interface AuthRoute {
	pathname: string;
	redirectTo: string;
}

const AUTHORIZED_ROUTES: AuthRoute[] = [
	{
		pathname: "/visualize",
		redirectTo: "/"
	},
	{
		pathname: "/tracking",
		redirectTo: "/"
	}
]

export { type AuthRoute, AUTHORIZED_ROUTES }