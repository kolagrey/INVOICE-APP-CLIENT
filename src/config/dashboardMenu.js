import {
  AccountBalanceWalletIcon,
  MoneyIcon,
  SupervisedUserIcon,
  SettingsIcon,
  DashboardIcon,
  PollIcon,
  StoreIcon,
  AccountCircle,
  PeopleIcon
} from '../materials';

const dashboardMenu = (state) => [
  {
    text: 'Overview',
    icon: DashboardIcon,
    url: '/dashboard',
    badge: state.notifications
  },
  {
    text: 'Customers',
    icon: PeopleIcon,
    url: '/dashboard/customers'
  },
  {
    text: 'Properties',
    icon: StoreIcon,
    url: '/dashboard/properties'
  },
  {
    text: 'Invoices',
    icon: MoneyIcon,
    url: '/dashboard/invoices'
  },
  {
    text: 'Receipts',
    icon: AccountBalanceWalletIcon,
    url: '/dashboard/receipts'
  },
  {
    text: 'Report',
    icon: PollIcon,
    url: '/dashboard/report'
  },
  {
    text: 'Users',
    icon: SupervisedUserIcon,
    url: '/dashboard/users'
  },
  {
    text: 'My Profile',
    icon: AccountCircle,
    url: '/dashboard/profile'
  },
  {
    text: 'Settings',
    icon: SettingsIcon,
    url: '/dashboard/settings'
  }
];

export default dashboardMenu;
