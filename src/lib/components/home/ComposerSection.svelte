<script lang="ts">
    import FancyHeading from './FancyHeading.svelte';
</script>

<!-- id="compose": היעד של כפתור הגיבור "העלו בעיה והציבו פרס" -->
<section class="compose" id="compose">
    <div class="inner">
        <div class="banner">
            <FancyHeading as="h2" title="הציבו אתגר לפתרון" />
            <p class="lede">תארו את הבעיה, קבעו פרס, והמומחים כבר יראו אותה.</p>
            <div class="acts">
                <a class="btn btn-primary" href="/problems/new">הציבו אתגר לפתרון</a>
                <a class="btn btn-ghost" href="/problems">הצטרפו לאתגר קיים</a>
            </div>
        </div>
    </div>
</section>

<style>
    .compose { padding-block: clamp(20px, 3.4cqi, 36px); }
    .banner {
        display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center;
        padding: clamp(16px, 3cqi, 28px); border: 1px solid var(--line); border-radius: 12px;
        background: color-mix(in srgb, var(--honey) 10%, var(--surface));
    }
    .lede { font-size: 15px; color: var(--fg-mute); }
    .acts { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
</style>
