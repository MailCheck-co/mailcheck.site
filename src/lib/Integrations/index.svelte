<script lang="ts">
  import { inview } from 'svelte-inview';
  import { inviewOptions } from '$utils/site-data';
  import integromat from '$lib/Integrations/integromat.svg';
  import mailchimp from '$lib/Integrations/mailchimp-logo.svg';
  import n8n from '$lib/Integrations/n8n-logo.svg';
  import sendgrid from '$lib/Integrations/sendgrid.svg';
  import WP from '$lib/Integrations/WordPress_logo.svg';
  import zapier from '$lib/Integrations/zapier-official.svg';
  import mailerlite from '$lib/Integrations/mailer-lite.svg';
  import woodpecker from '$lib/Integrations/woodpecker.svg';
  import activecampaign from '$lib/Integrations/active-campaign-logo.svg';

  let intersecting: boolean;
</script>

<section
  class="integrations"
  class:intersecting
  use:inview={inviewOptions}
  on:enter={(event) => {
    const { inView } = event.detail;
    intersecting = inView;
  }}>
  <div class="section-heading sm-left">
    <h2 class="title">Integrations</h2>
    <p class="section-title-lg">Integrations</p>
  </div>
  <div class="container">
    <div class="integrations-list">
      <div class="integrations-list-item" data-item-title="Mailchimp">
        <img width="50" height="50" src={mailchimp} alt="Mailchimp" class="integrations-logo" />
        <a rel="external" href="https://mailcheck.co/mailchimp-integration" class="integrations-link"></a>
      </div>
      <div class="integrations-list-item" data-item-title="Zapier">
        <img width="50" height="50" src={zapier} alt="Zapier" class="integrations-logo" />
        <a rel="external" href="https://mailcheck.co/zapier-integration" class="integrations-link"></a>
      </div>
      <div class="integrations-list-item" data-item-title="WordPress">
        <img width="50" height="50" src={WP} alt="WordPress" class="integrations-logo" />
        <a rel="external" href="https://wordpress.org/plugins/mailcheck-co/" class="integrations-link"></a>
      </div>
      <div class="integrations-list-item" data-item-title="Make.com">
        <img width="50" height="50" src={integromat} alt="Make.com" class="integrations-logo" />
        <a rel="external" href="https://mailcheck.co/integromat-integration" class="integrations-link"></a>
      </div>
      <div class="integrations-list-item" data-item-title="Sendgrid">
        <img width="50" height="50" src={sendgrid} alt="Sendgrid" class="integrations-logo" />
        <a rel="external" href="https://mailcheck.co/sendgrid-integration" class="integrations-link"></a>
      </div>
      <div class="integrations-list-item" data-item-title="N8N">
        <img width="50" height="50" src={n8n} alt="N8N" class="integrations-logo" />
        <a rel="external" href="https://app.mailcheck.co/dashboard/integration" class="integrations-link"></a>
      </div>
      <div class="integrations-list-item" data-item-title="Mailerlite">
        <img width="50" height="50" src={mailerlite} alt="Mailerlite" class="integrations-logo" />
        <a rel="external" href="https://app.mailcheck.co/dashboard/integration" class="integrations-link"></a>
      </div>
      <div class="integrations-list-item" data-item-title="Woodpecker">
        <img width="50" height="50" src={woodpecker} alt="Woodpecker" class="integrations-logo" />
        <a rel="external" href="https://app.mailcheck.co/dashboard/integration" class="integrations-link"></a>
      </div>
      <div class="integrations-list-item" data-item-title="ActiveCampaign">
        <img
          width="50"
          height="50"
          src={activecampaign}
          alt="Active Campaign"
          class="integrations-logo" />
        <a rel="external" href="https://app.mailcheck.co/dashboard/integration" class="integrations-link"></a>
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

    &:hover{
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
