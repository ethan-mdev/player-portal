declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				id: string;
				username: string;
				role: string;
				profile_image: string | null;
				access_token: string;
			};

		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
