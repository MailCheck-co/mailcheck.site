<script lang="ts">
  import { inview } from 'svelte-inview';
  import { inviewOptions } from '$utils/site-data';
  // assets
  import makeCom from '$lib/Integrations/make.com.svg';
  import mailchimp from '$lib/Integrations/mailchimp-logo.svg';
  import n8n from '$lib/Integrations/n8n-logo.svg';
  import sendgrid from '$lib/Integrations/sendgrid.svg';
  import WP from '$lib/Integrations/WordPress_logo.svg';
  import zapier from '$lib/Integrations/zapier-official.svg';
  import mailerLite from '$lib/Integrations/mailer-lite.svg';
  import woodpecker from '$lib/Integrations/woodpecker.svg';
  import activeCampaign from '$lib/Integrations/active-campaign-logo.svg';

  let intersecting: boolean;
</script>

<section
  class="integrations"
  class:intersecting
  use:inview={inviewOptions}
  on:enter={(event) => {
    const { inView } = event.detail;
    intersecting = inView;
  }}
>
  <div class="section-heading sm-left">
    <h2 class="title">Integrations</h2>
    <p class="section-title-lg">Integrations</p>
  </div>
  <div class="container">
    <div class="integrations-list">
      <div class="integrations-list-item" data-item-title="Mailchimp">
        <a href="/mailchimp-integration" class="integrations-link">
          <img
            loading="lazy"
            decoding="async"
            width="50"
            height="50"
            src={mailchimp}
            alt="Mailchimp"
            class="integrations-logo"
          />
        </a>
      </div>
      <div class="integrations-list-item" data-item-title="Zapier">
        <a href="/zapier-integration" class="integrations-link">
          <img
            loading="lazy"
            decoding="async"
            width="50"
            height="50"
            src={zapier}
            alt="Zapier"
            class="integrations-logo"
          />
        </a>
      </div>
      <div class="integrations-list-item" data-item-title="WordPress">
        <a
          rel="external"
          href="https://wordpress.org/plugins/mailcheck-co/"
          class="integrations-link"
        >
          <img
            loading="lazy"
            decoding="async"
            width="50"
            height="50"
            src={WP}
            alt="WordPress"
            class="integrations-logo"
          />
        </a>
      </div>
      <div class="integrations-list-item" data-item-title="Make.com">
        <a href="/make-com-integration" class="integrations-link">
          <img width="50" height="50" src={makeCom} alt="Make.com" class="integrations-logo" />
        </a>
      </div>
      <div class="integrations-list-item" data-item-title="Sendgrid">
        <a href="/sendgrid-integration" class="integrations-link">
          <img
            loading="lazy"
            decoding="async"
            width="50"
            height="50"
            src={sendgrid}
            alt="Sendgrid"
            class="integrations-logo"
          />
        </a>
      </div>
      <div class="integrations-list-item" data-item-title="N8N">
        <a
          rel="external"
          href="https://app.mailcheck.co/dashboard/integration"
          class="integrations-link"
        >
          <img
            loading="lazy"
            decoding="async"
            width="50"
            height="50"
            src={n8n}
            alt="N8N"
            class="integrations-logo"
          />
        </a>
      </div>
      <div class="integrations-list-item" data-item-title="Mailerlite">
        <a href="/mailerlite-integration" class="integrations-link">
          <img
            loading="lazy"
            decoding="async"
            width="50"
            height="50"
            src={mailerLite}
            alt="Mailerlite"
            class="integrations-logo"
          />
        </a>
      </div>
      <div class="integrations-list-item" data-item-title="Woodpecker">
        <a href="/woodpecker-integration" class="integrations-link">
          <img
            loading="lazy"
            decoding="async"
            width="50"
            height="50"
            src={woodpecker}
            alt="Woodpecker"
            class="integrations-logo"
          />
        </a>
      </div>
      <div class="integrations-list-item" data-item-title="ActiveCampaign">
        <a
          rel="external"
          href="https://app.mailcheck.co/dashboard/integration"
          class="integrations-link"
        >
          <img
            loading="lazy"
            decoding="async"
            width="50"
            height="50"
            src={activeCampaign}
            alt="Active Campaign"
            class="integrations-logo"
          />
        </a>
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  .integrations {
    @include intersection;

    padding: var(--size-50) 0;
  }

  .integrations-list {
    position: relative;
    display: flex;
    flex-flow: row wrap;
    gap: var(--size-40);
    align-items: stretch;
    justify-content: center;
  }

  .integrations-list-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 50px;
    max-height: 50px;
    padding: var(--size-30);
    background: linear-gradient(135deg, rgb(255 255 255 / 10%) 0%, rgb(255 255 255 / 0%) 100%);
    border: 1px solid var(--primary-white);
    border-radius: var(--size-30);
    box-shadow: var(--color-shadow);
    backdrop-filter: blur(10px);

    &:hover {
      background: linear-gradient(135deg, rgb(255 255 255 / 25%) 0%, rgb(255 255 255 / 0%) 100%);
    }

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      min-width: 100%;
      color: var(--primary-white);
      text-align: center;
      opacity: 0;
      transition: var(--transition-default);
      content: attr(data-item-title);
    }

    &:hover::before {
      opacity: 1;
      transform: translateY(-150%);
    }

    .integrations-link::before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>
