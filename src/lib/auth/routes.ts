interface AuthRoute {
	pathname: string;
	redirectTo: string;
}

const AUTHORIZED_ROUTES: AuthRoute[] = [
	{
		pathname: '/visualize',
		redirectTo: '/sign-in'
	},
	{
		pathname: '/tracking',
		redirectTo: '/sign-in'
	}
];

export { type AuthRoute, AUTHORIZED_ROUTES };
