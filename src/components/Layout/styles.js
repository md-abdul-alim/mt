import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  root: {
    display: "flex",
    maxWidth: "100vw",
    overflowX: "hidden",
    overflowY: "hidden",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0),
    width: `calc(100vw - 240px)`,
    minHeight: "100vh",
    paddingBottom: theme.spacing(7)
  },
  contentShift: {
    width: `calc(100vw - ${240 + theme.spacing(6)}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  fakeToolbar: {
    ...theme.mixins.toolbar,
  },
  link: {
    '&:not(:first-child)': {
      paddingLeft: 15
    }
  },
  fixedBottom: {
    position: 'fixed',
    backgroundColor: '#222A45',
    color: "#ffffff",
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: 0,
    zIndex: 1200
  },
  fixedBottomShift: {
    width: `calc(100vw - ${240 + theme.spacing(6)}px)`,
  }
}));
