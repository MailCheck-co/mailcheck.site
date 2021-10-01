<script>
  import Progress from '$lib/Progress/index.svelte';

  let modalVisibility = false;

  export function show() {
    modalVisibility = true;
  }

  export function hide() {
    modalVisibility = false;
    isSending = false;
    isValid = false;
    document.body.classList.remove('fixed');
  }

  let emailValue = '';
  let subjectValue = '';
  let isSending = false;
  let isValid;

  let isOpen;
  let isError;
  let popUpBlock;

  let modalForm = {
    reset: () => {
      ('');
    }
  };

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
      modalForm.reset();
    } catch (e) {
      isError = true;
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

  <div class="popup-container" class:open={isOpen} on:click={hide} bind:this={popUpBlock}>
    <div class="popup" class:open={isOpen}>
      <span class="popup-close success" />
      <span class="popup-thanks">Thanks for filling out our form!</span>
      <p class="popup-text">
        We will look over your message and get back to you by tomorrow. Your friends at MailCheck!
      </p>
    </div>
    <div class="popup" class:open={isError && isOpen}>
      <span class="popup-close error" />
      <span class="popup-thanks">Something went wrong!</span>
      <p class="popup-text">Please try again later</p>
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
  }

  .modal-btn {
    margin: var(--size-20) 0;
    color: var(--primary-white);
    background-color: var(--primary-accent);
    border: 1px solid var(--primary-white);
    outline: none;
  }

  .popup-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 6;
    display: none;
    width: 100%;
    height: 100%;

    &.open {
      display: flex;
      animation-name: fade;
      animation-duration: 1s;
      animation-fill-mode: forwards;
    }

    &::before {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: inherit;
      filter: blur(var(--size-20));
      content: '';
    }

    .popup {
      position: fixed;
      top: calc(50% - 9.875rem);
      right: 0;
      bottom: 0;
      left: 0;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      max-width: 40rem;
      height: 19.75rem;
      margin: 0 auto;
      color: var(--primary-white);
      background-image: var(--popup-bg-gradient);

      &.open {
        display: flex;
        animation-name: fade-in;
        animation-duration: 1s;
        animation-fill-mode: forwards;
      }

      .popup-close {
        position: absolute;
        top: var(--size-20);
        right: var(--size-20);
        display: block;
        width: var(--size-24);
        height: var(--size-24);
        cursor: pointer;

        &::before {
          position: relative;
          top: 10px;
          display: block;
          width: var(--size-24);
          height: 3px;
          background: var(--primary-white);
          transform: rotate(-45deg);
          content: '';
        }

        &::after {
          position: relative;
          top: 7px;
          right: 0;
          display: block;
          width: var(--size-24);
          height: 3px;
          background-color: var(--primary-white);
          transform: rotate(45deg);
          content: '';
        }
      }

      .popup-thanks {
        color: var(--primary-white);
        font-weight: var(--weight-700);
        font-size: var(--size-36);
        line-height: var(--size-40);
        letter-spacing: var(--size-2);
        text-align: center;
        text-transform: uppercase;
      }

      .popup-text {
        max-width: 32.5rem;
        color: var(--primary-white);
        font-weight: var(--weight-400);
        font-size: var(--size-16);
        letter-spacing: var(--letter-spacing);
        text-align: center;
      }
    }
  }

  @media only screen and (max-width: 480px) {
    .popup {
      .popup-thanks {
        margin-top: var(--size-20);
      }
    }
  }

  @media only screen and (max-width: 768px) {
    .popup {
      height: 100%;
      max-height: 16rem;
      margin: 0 var(--size-20);

      .popup-thanks {
        max-width: 95%;
        font-size: var(--size-24);
        line-height: var(--size-28);
      }

      .popup-text {
        max-width: 80%;
        font-size: var(--size-16);
      }
    }
  }
</style>
