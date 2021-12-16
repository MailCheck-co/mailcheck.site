<script lang="ts">
  import { inview } from 'svelte-inview';
  import { inviewOptions } from '$utils/site-data';
  import integromat from '$lib/Integrations/integromat.svg';
  import mailchimp from '$lib/Integrations/mailchimp-logo.svg';
  import n8n from '$lib/Integrations/n8n-logo.svg';
  import sendgrid from '$lib/Integrations/sendgrid.svg';
  import WP from '$lib/Integrations/WordPress_logo.svg';
  import zapier from '$lib/Integrations/zapier-official.svg';

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
    <h2 class="title">Software Partners</h2>
    <p class="section-title-lg">Integrations</p>
  </div>
  <div class="container">
    <div class="integrations-list">
      <div class="integrations-list-item">
        <img width="150" height="60" src={integromat} alt="5000 miles" class="integrations-logo"/>
      </div>
      <div class="integrations-list-item">
        <img width="150" height="60" src={mailchimp} alt="Bagllet" class="integrations-logo"/>
      </div>
      <div class="integrations-list-item">
        <img width="150" height="19" src={n8n} alt="Acell Mail" class="integrations-logo"/>
      </div>
      <div class="integrations-list-item">
        <img width="150" height="60" src={sendgrid} alt="Sammy-logo" class="integrations-logo"/>
      </div>
      <div class="integrations-list-item">
        <img width="150" height="60" src={WP} alt="Zitkani" class="integrations-logo"/>
      </div>
      <div class="integrations-list-item">
        <img width="150" height="60" src={zapier} alt="ECHO" class="integrations-logo"/>
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
    align-items: stretch;
    justify-content: center;
    gap: var(--size-20);
  }

  .integrations-list-item {
    padding: var(--size-10);
    text-align: center;
    display: flex;
    flex: 1 0 auto;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--background-without-opacity);
    border-radius: var(--br-10);

    & > img {
      max-height: var(--size-60);
    }
  }
</style>
