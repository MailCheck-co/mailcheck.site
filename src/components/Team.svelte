<style lang="scss">
  @import "../scss/utilities/index";
  @import "../scss/molecules/team";
</style>

<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let element: HTMLElement;
  let intersecting: boolean;
</script>

<IntersectionObserver threshold={0.1} {element} bind:intersecting once={true}>
  <section class="team" bind:this={element} class:intersecting>
    <div class="container">
      <div class="section-wrapper">
        <div class="section-heading sm-left">
          <h2 class="title">MAILCHECK TEAM</h2>
          <p class="section-title-lg">TEAM</p>
        </div>
        <div class="team-members">
          <div class="team-member csm">
            <div class="team-member-avatar">
              <img
                src="/assets/img/team/serega-karetnik.png"
                alt="csm"
                class="avatar" />
            </div>
            <div class="team-member-info">
              <p class="team-member-name">Serhii Karetnyk</p>
              <p class="team-member-description">CSM</p>
            </div>
          </div>
          <div class="team-member cto">
            <div class="team-member-avatar">
              <img
                src="/assets/img/team/konstantin-nosov.png"
                alt="cto"
                class="avatar" />
            </div>
            <div class="team-member-info">
              <p class="team-member-name">Konstantin Nosov</p>
              <p class="team-member-description">CTO / Founder</p>
            </div>
          </div>
          <div class="team-member own">
            <div class="team-member-avatar">
              <img
                src="/assets/img/team/fara-muhammadiev.png"
                alt="own"
                class="avatar" />
            </div>
            <div class="team-member-info">
              <p class="team-member-name">Fara Muhammadiev</p>
              <p class="team-member-description">Product Owner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</IntersectionObserver>
