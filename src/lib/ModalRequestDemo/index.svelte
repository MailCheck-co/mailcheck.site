<script>
  import Progress from '$lib/Progress/index.svelte';

  let modalVisibility = false;
  let emailValue = '';
  let subjectValue = 'Request for Demo';
  let isSending = false;
  let isError = false;
  let isSuccess = false;
  let isValid = true;

  let modalForm = {
    reset: () => {
      ('');
    }
  };

  export function show() {
    modalVisibility = true;
  }

  export function hide() {
    modalVisibility = false;
    isSending = false;
    isValid = false;
    isError = false;
    isSuccess = false;
  }


  function validate() {
    return {
      update() {
        const reg =
          /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        return (isValid = reg.test(String(emailValue).toLowerCase()));
      }
    };
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    isSending = true;
    isValid = true;
    const referrerValue = document.referrer;
    const data = {
      email: emailValue,
      subject: subjectValue,
      referrer: referrerValue
    };

    try {
      await fetch('/api/sendMail', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      isSuccess = true;
      isSending = false;
      modalForm.reset();
      console.log(emailValue);
    } catch (e) {
      isError = true;
      isSending = false;
      console.error(e);
    }
  };
</script>

{#if modalVisibility}
  <div class="modal" on:click|self={() => hide()}>
    <div class="modal-content">
      <button type="button" class="modal-close" on:click={() => hide()}>&times;</button>
      <form action="" class="modal-form" bind:this={modalForm} on:submit|once={onSubmit}>
        <h4 class="modal-title">We look forward to connecting with you</h4>
        <input
          type="email"
          class="modal-input"
          bind:value={emailValue}
          use:validate={emailValue}
          class:invalid={!isValid}
          placeholder="Enter your business email address *"
          required />
        {#if isSuccess}
          <span class="status-title success">Message sent!</span>
          <span>Thanks for your request!</span>
        {:else if isError}
          <span class="status-title error">Something went wrong! </span>
          <span>Please try again later</span>
        {/if}
        <button type="submit" class="btn modal-btn" disabled={!isValid}>
          {#if isSending}
            <span class="progress-wrapper">
              <Progress />
            </span>
          {:else}
            submit
          {/if}
        </button>
      </form>
    </div>
  </div>
{/if}

<style lang="scss">
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    display: grid;
    place-items: center;
    background-color: var(--heading-color);
  }

  .modal-content {
    min-width: 30%;
    max-width: calc(100% - var(--size-50));
    padding: var(--size-20);
    background-color: var(--primary-white);
    border-radius: var(--br-10);
  }

  .modal-close,
  .modal-close:focus,
  .modal-close:active {
    margin-left: auto;
    display: block;
    font-size: var(--size-30);
    background: none;
    outline: none;
    border: none;
  }

  .modal-close:hover {
    font-weight: bold;
  }

  .modal-form {
    display: flex;
    align-items: center;
    flex-flow: column nowrap;
  }

  .modal-title {
    text-indent: unset;
  }

  .modal-input {
    display: block;
    box-sizing: border-box;
    width: 100%;
    max-height: 3.25rem;
    margin-bottom: var(--size-20);
    padding: var(--size-20);
    color: var(--color-text);
    font-size: var(--size-16);
    border: var(--size-1) solid var(--primary-accent);
    border-radius: var(--size-6);

    &:focus {
      border-color: var(--midnight-blue);
    }

    &.invalid {
      color: var(--color-important);
      border-color: var(--color-important);
    }
  }

  .modal-btn {
    margin: var(--size-20) 0;
    color: var(--primary-white);
    background-color: var(--primary-accent);
    border: 1px solid var(--primary-white);
    outline: none;
  }

  .status-title {
    color: var(--color-text);
    font-weight: var(--weight-700);
    font-size: var(--size-16);
    line-height: var(--size-40);
    letter-spacing: var(--size-2);
    text-align: center;
    text-transform: uppercase;

    &.success {
      color: var(--color-success);
    }

    &.error {
      color: var(--color-important);
    }
  }

  @media only screen and (max-width: 480px) {
    .status-title {
      margin-top: var(--size-20);
    }
  }

  @media only screen and (max-width: 768px) {
    .status-title {
      max-width: 95%;
      font-size: var(--size-24);
      line-height: var(--size-28);
    }
  }
</style>
