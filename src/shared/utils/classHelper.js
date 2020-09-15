import { colors } from '../../materials';

const drawerWidth = 240;
const useStyles = (makeStyles) =>
  makeStyles((theme) => ({
    highlight: 'light',
    listViewTitle: {
      flex: '1 1 100%'
    },
    toolbarRoot: {
      flex: '1 1 100%',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    pageRoot: {
      backgroundColor: theme.palette.background.dark,
      minHeight: '100%',
      paddingBottom: theme.spacing(3),
      paddingTop: theme.spacing(3)
    },
    loginRoot: {
      height: '100vh'
    },
    loading: {
      color: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
    },
    importButton: {
      marginRight: theme.spacing(1)
    },
    exportButton: {
      marginRight: theme.spacing(1)
    },
    button: {
      margin: theme.spacing(3, 0, 2),
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      height: 48,
      padding: '0 30px'
    },
    image: {
      backgroundImage: 'url(https://source.unsplash.com/random)',
      backgroundRepeat: 'no-repeat',
      backgroundColor:
        theme.palette.type === 'dark'
          ? theme.palette.grey[900]
          : theme.palette.grey[50],
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main
    },
    profileAvatar: {
      height: 100,
      width: 100
    },
    userAvatar: {
      maxHeight: 36,
      maxWidth: 36
    },
    logo: {
      margin: theme.spacing(1),
      maxHeight: 80,
      maxWidth: 80
    },
    icon80: {
      margin: theme.spacing(1),
      maxHeight: 80,
      maxWidth: 80
    },
    table: {
      minWidth: 640
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1)
    },

    submit: {
      margin: theme.spacing(3, 0, 2),
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      height: 48,
      padding: '0 30px'
    },
    root: {
      display: 'flex'
    },
    listRoot: {
      width: '100%',
      backgroundColor: 'none'
    },
    inline: {
      display: 'inline'
    },
    notificationListItem: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: 6,
      marginBottom: 8
    },
    appBar: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    menuButton: {
      marginRight: 36
    },
    hide: {
      display: 'none'
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap'
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1
      }
    },
    toolbarMenu: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar
    },
    content: {
      flexGrow: 1,
      width: '100%',
      padding: theme.spacing(3)
    },
    grow: {
      flexGrow: 1
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block'
      }
    },
    inputRoot: {
      color: 'inherit'
    },
    fileInput: {
      display: 'none'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 200
      }
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex'
      }
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none'
      }
    },
    logoIcon: {
      height: 36,
      width: 36,
      marginRight: 8
    },
    error: {
      color: 'red'
    },
    alignItemCenter: {
      alignItems: 'center'
    },
    card: {},
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4)
    },
    differenceIcon: {
      color: colors.red[900]
    },
    differenceValue: {
      color: colors.red[900],
      marginRight: theme.spacing(1)
    },
    paperCard: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column'
    },
    summaryPaper: {
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing(3),
      height: 260,
      alignItems: 'center'
    },
    summaryBox: {
      width: '100%',
      alignItems: 'center',
      display: 'flex'
    },
    summaryTitle: {
      width: '100%',
      fontSize: '1rem',
      fontWeight: 500,
      textAlign: 'center'
    },
    summaryValue: {
      width: '100%',
      fontSize: '2rem',
      fontWeight: 500,
      textAlign: 'center'
    },
    depositContext: {
      flex: 1
    }
  }));

export { useStyles };
