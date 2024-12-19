import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar, Box, CircularProgress, IconButton, Toolbar, Typography, Tooltip, Container } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChessDataService, { GenderEnum, CategoryEnum, TypeEnum, PlayerDto } from './services/ChessDataService';

const Player = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [playerData, setPlayerData] = useState<PlayerDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);

      ChessDataService.fetchPlayer(id)
        .then((player: PlayerDto) => {
          setPlayerData(player);
        })
        .catch(() => setError('Failed to fetch player data'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress size="30px" />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (!playerData) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Typography>No player data available.</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      <AppBar position="static" color={playerData.gender === GenderEnum.Women ? 'secondary' : 'primary'}>
        <Toolbar>
          <Tooltip title="Back">
            <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6">{playerData.name}</Typography>
        </Toolbar>
      </AppBar>
      <Box display="flex" flexDirection="column" padding={2}>
        <Box paddingBottom={2} borderBottom="1px solid #ddd" display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box>
            {playerData.id && playerData.fideName && <Typography variant="body1">FIDE Id:</Typography>}
            {playerData.fideName && <Typography variant="body1">FIDE Name:</Typography>}
            {playerData.fed && <Typography variant="body1">Federation:</Typography>}
            {playerData.yob && <Typography variant="body1">Year of Birth:</Typography>}
          </Box>
          <Box>
            {playerData.id && playerData.fideName && <Typography variant="body1">{playerData.id}</Typography>}
            {playerData.fideName && <Typography variant="body1">{playerData.fideName}</Typography>}
            {playerData.fed && <Typography variant="body1">{playerData.fed}</Typography>}
            {playerData.yob && <Typography variant="body1">{`${playerData.yob} (${new Date().getFullYear() - playerData.yob}  years)`}</Typography>}
          </Box>
        </Box>
        <Box paddingTop={2}>
          <Typography variant="body1">Top results:</Typography>
        </Box>
        {[...new Set(playerData.results.map((result) => result.rank))].map((rank) => (
          <Box
            key={rank}
            padding={2}
            display="flex"
            border="1px solid #ddd"
            borderRadius="8px"
            marginTop={2}
            boxShadow="0px 4px 6px rgba(63, 81, 181, 0.3)"
            bgcolor={rank <= 3 ? 'white' : ''}>
            <Box margin="5px">
              <Typography variant="body1">{rank}.</Typography>
            </Box>
            <Box>
              {playerData.results
                .filter((result) => result.rank === rank)
                .map((result, index) => (
                  <Box
                    key={index}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    onClick={() => navigate(`/${result.year}/${CategoryEnum[result.category]}/${TypeEnum[result.type]}/${GenderEnum[result.gender]}`)}
                  >
                    <Typography
                      variant="body1"
                      sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                      {`${GenderEnum[result.gender]}${result.category !== CategoryEnum.All ? ` ${CategoryEnum[result.category]}` : ''} ${TypeEnum[result.type]} ${result.year} ${playerData.yob ? ' (' + (result.year - playerData.yob) + ' years)' : ''}`}
                    </Typography>
                    <IconButton size="small">
                      <ArrowForwardIcon />
                    </IconButton>
                  </Box>
                ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Player;