import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Button, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import ChessDataService from './services/ChessDataService';

import 'swiper/css';
import './App.css';

const years = [2024, 2023, 2022, 2021, 2020];
const categories = ['All', 'U20', 'U18', 'U16', 'U14', 'U12', 'U10', 'U08'];
const types = ['Rapid', 'Classical', 'Blitz'];
const genders = ['Open', 'Women'];

interface Player {
  rank: number;
  name: string;
  fed?: string;
  club?: string;
  coach1?: string;
  coach2?: string;
  notes?: string;
}

interface PlayersData {
  [key: string]: Player[];
}

const App = () => {
  const { paramYear, paramCategory, paramType, paramGender } = useParams();
  const navigate = useNavigate();

  const [currentYear, setCurrentYear] = useState(() => Number(paramYear) || years[0]);
  const [currentCategory, setCurrentCategory] = useState(() => paramCategory || categories[0]);
  const [currentType, setCurrentType] = useState(() => paramType || types[1]);
  const [currentGender, setCurrentGender] = useState(() => paramGender || genders[0]);
  const [playersData, setPlayersData] = useState<PlayersData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let year = currentYear;
    let category = currentCategory;
    let type = currentType;
    let gender = currentGender;

    let dataKey = `${year}_${category}_${type}_${gender}`;
    if (!playersData[dataKey]) {
      setLoading(true);

      ChessDataService.fetchPlayers(year, category, type, gender)
        .then((results: Player[]) => {
          setPlayersData((prev) => ({
            ...prev,
            [`${dataKey}`]: results,
          }));
        })
        .finally(() => setLoading(false));
    }
    navigate(`/${year}/${category}/${type}/${gender}`, { replace: true });
  }, [currentYear, currentCategory, currentType, currentGender]);

  return (
    <Box display="flex" flexDirection="row" height="100vh">
      <Box width="auto" padding={1}>
        <Box display="flex" flexDirection="column" height="50%">
          {years.map(year => (
            <Button key={year} variant={year === currentYear ? 'contained' : 'text'} color={currentGender === genders[0] ? 'primary' : 'secondary'} onClick={() => setCurrentYear(year)}>{year}</Button>
          ))}
        </Box>
        <Box display="flex" flexDirection="column" height="50%">
          {categories.map(category => (
            <Button key={category} variant={category === currentCategory ? 'contained' : 'text'} color={currentGender === genders[0] ? 'primary' : 'secondary'} onClick={() => setCurrentCategory(category)}>{category}</Button>
          ))}
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" flexGrow={1} minWidth="0">
        <Box textAlign="center" padding={1}>
          {genders.map(gender => (
            <Button key={gender} variant={gender === currentGender ? 'contained' : 'text'} color={currentGender === genders[0] ? 'primary' : 'secondary'} onClick={() => setCurrentGender(gender)}>{gender}</Button>
          ))}
        </Box>

        <Box flexGrow={1} padding={0} minWidth="0">
          <Swiper
            direction="horizontal"
            initialSlide={years.indexOf(currentYear)}
            loop={true}
            spaceBetween={10}
            slidesPerView={1}
            onSlideChangeTransitionEnd={(swiper) => {
              const newYear = years[swiper.realIndex];
              setCurrentYear(newYear);
            }}
          >
            {years.map(year => (
              <SwiperSlide key={`${year}`}>
                <Box>
                  <Typography variant="h5" align="center">
                    {`${currentGender}${currentCategory !== 'All' ? ' ' + currentCategory : ''} ${currentType} ${currentYear}`}
                  </Typography>
                  <Box display="flex" flexDirection="column" p={2}>
                    {loading ? (
                      <CircularProgress size="30px" />
                    ) : (
                        playersData[`${currentYear}_${currentCategory}_${currentType}_${currentGender}`]?.map((player) => (
                        <Box key={player.rank} padding={2}
                          display="flex"
                          border="1px solid #ddd"
                          borderRadius="8px"
                          marginBottom="8px"
                          boxShadow="0px 4px 6px rgba(63, 81, 181, 0.3)"
                          bgcolor={player.rank <= 3 ? 'white' : ''}>
                          <Box marginRight={1}>
                            <Typography variant="body1">{player.rank}.</Typography>
                          </Box>
                          <Box>
                            <Typography variant="body1">{player.name}</Typography>
                            {player.fed && (<Typography variant="body2" paddingLeft={1}>{player.fed}</Typography>)}
                            {player.club && (<Typography variant="body2" paddingLeft={2}>{player.club}</Typography>)}
                            {player.coach1 && (<Typography variant="body2" paddingLeft={3}>{player.coach1}</Typography>)}
                            {player.coach2 && (<Typography variant="body2" paddingLeft={4}>{player.coach2}</Typography>)}
                            {player.notes && (<Typography variant="body2" paddingLeft={2}>{player.notes}</Typography>)}
                          </Box>
                        </Box>
                      ))
                    )}
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        <Box textAlign="center" padding={1}>
          {types.map(type => (
            <Button key={type} variant={type === currentType ? 'contained' : 'text'} color={currentGender === genders[0] ? 'primary' : 'secondary'} onClick={() => setCurrentType(type)}>{type}</Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default App;