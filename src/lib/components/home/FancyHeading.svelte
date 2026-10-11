<script lang="ts">
    // כותרת בעיצוב של אתר חכמי העדה: ענפי זית, ❦ משני הצדדים, טקסט בגרדיאנט וקו ענבר מתחת.
    let { title }: { title: string } = $props();
</script>

<div class="fancy">
    <div class="row">
        <img class="olive olive-a" src="/images/olive-branch.webp" alt="" aria-hidden="true" width="400" height="183" decoding="async" />
        <span class="orn" aria-hidden="true">❦</span>
        <h3>{title}</h3>
        <span class="orn" aria-hidden="true">❦</span>
        <img class="olive olive-b" src="/images/olive-branch.webp" alt="" aria-hidden="true" width="400" height="183" decoding="async" />
    </div>
    <div class="line" aria-hidden="true"></div>
</div>

<style>
    .fancy { text-align: center; }
    .row { display: flex; align-items: center; justify-content: center; gap: 4px; }
    h3 {
        display: inline-block; padding-bottom: 4px; white-space: nowrap; font-size: clamp(22px, 3.4cqi, 32px); font-weight: 900; line-height: 1.2;
        background: linear-gradient(to right, #3b82f6, #8b5cf6); -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .orn { font-size: 22px; color: #b45309; text-shadow: 0 1px 1px rgba(120, 53, 15, 0.4); }
    .olive { height: 30px; width: auto; object-fit: contain; user-select: none; --flip: 1; transform: translateY(0.5rem) scaleX(var(--flip)) scaleY(-1); }
    .olive-b { --flip: -1; }
    .line { width: clamp(150px, 40cqi, 256px); height: 2px; margin: 4px auto 0; background: linear-gradient(to right, transparent, #b45309, transparent); }

    @container home (max-width: 560px) {
        .olive { display: none; }
    }
</style>
