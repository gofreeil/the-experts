<script lang="ts">
	import { _ } from "svelte-i18n";
</script>

<!-- אזהרה גלובלית: האתר בבנייה ומשמש לתצוגה בלבד — פס דק בראש העמוד (לא דביק, נגלל החוצה) -->
<div class="build-notice" role="note">
	<span aria-hidden="true">🚧</span>
	<span>{$_("beta_notice")}</span>
</div>

<style>
	.build-notice {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.3rem 0.75rem;
		font-size: 0.8rem;
		font-weight: 600;
		line-height: 1.3;
		text-align: center;
		color: #3b2a00;
		background: linear-gradient(90deg, #f5d57a, #fbe7a1, #f5d57a);
		border-bottom: 1px solid rgba(0, 0, 0, 0.15);
	}
	@media (max-width: 768px) {
		.build-notice {
			font-size: 0.72rem;
			padding: 0.25rem 0.5rem;
		}
	}
</style>
