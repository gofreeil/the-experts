// See https://svelte.dev/docs/kit/types#app.d.ts
import type { DefaultSession } from '@auth/sveltekit';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: () => Promise<import('@auth/sveltekit').Session | null>;
			/** שפת הגולש לפי ?lang= / עוגיית lang (hooks.server.ts) */
			locale: import('$lib/i18n').Locale;
		}
		interface PageData {
			session?: import('@auth/sveltekit').Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '@auth/core/types' {
	interface Session {
		user: {
			id: string;
			provider?: string;
			strapiJwt?: string;
		} & DefaultSession['user'];
	}
}

declare module '@auth/core/jwt' {
	interface JWT {
		dbUserId?: string;
		provider?: string;
		strapiJwt?: string;
		/** מתי נמשכה תמונת הפרופיל מ-Strapi לאחרונה (userAvatar.ts) */
		avatarAt?: number;
	}
}

export {};
