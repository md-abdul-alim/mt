import { CircularProgress, Box , Typography} from '@material-ui/core';

export const CustomCircularProgress = ({ size = 40, thickness = 4, color = 'primary', message }) => {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <CircularProgress size={size} thickness={thickness} color={color} />
        {message && <Typography variant="body1" color="textSecondary">{message}</Typography>}
      </Box>
    );
  };