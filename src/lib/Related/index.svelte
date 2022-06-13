<script lang="ts">
    export let posts = [];
  </script>
  
  <div class="related">
    {#each posts as { slug, title, snippet, thumbnail }}
      <div class="post">
        <img src={thumbnail} alt={title} />
        <h1 class="uppercase">{title}</h1>
        <p>{snippet}</p>
        <a href="/blog/{slug}" class="btn uppercase">read now</a>
      </div>
    {/each}
  </div>
  
  <style lang="scss">
    .related {
      display: flex;
      flex-direction: column;
  
      @media only screen and (min-width: 768px) {
        flex-direction: row;
      }
  
      .post {
        width: 30%;
        flex: 1 0 30%;
  
        img {
          width: 100%;
          height: auto;
        }
      }
    }
  </style>