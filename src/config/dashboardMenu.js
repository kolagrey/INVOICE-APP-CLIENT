import {
    AccountBalanceWalletIcon,
    MoneyIcon,
    PeopleAltIcon,
    SettingsIcon,
    DashboardIcon,
    PollIcon,
    StoreIcon,
    AccountCircle
} from '../materials';


const dashboardMenu = (state) => [
    {
        text: 'Overview',
        icon: DashboardIcon,
        url: '/dashboard',
        badge: state.notifications
    },
    {
        text: 'Tenants',
        icon: StoreIcon,
        url: '/dashboard/customers'
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
        icon: PeopleAltIcon,
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