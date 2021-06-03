<script lang="ts">
  let isValid: boolean;
  let email = '';
  let element: HTMLElement;
  let intersecting: boolean;
  let isOpen = false;
  let isError = false;
  let contactForm = { reset: () => {} };
  let popUpBlock: HTMLElement;
  let nameValue = '';
  let textareaValue = '';
  function validate(node: HTMLElement, value: string) {
    return {
      update() {
        const reg =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return (isValid = reg.test(String(email).toLowerCase()));
      }
    };
  }
  const onClose = () => {
    isOpen = false;
    isError = false;
    document.body.classList.remove('fixed');
  };
  const onSubmit = async () => {
    const referrerValue = document.referrer;
    const data = {
      name: nameValue,
      email,
      subject: textareaValue,
      referrer: referrerValue
    };

    try {
      await fetch('/api/sendMail', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      isOpen = true;
      contactForm.reset();
    } catch (e) {
      isOpen = true;
      isError = true;
      console.error(e);
    }

    document.body.classList.add('fixed');
    window.dataLayer?.push({
      eventCategory: 'site',
      eventAction: 'contactform',
      eventLabel: 'submit',
      eventValue: '',
      event: 'gaEvent'
    });
  };
</script>

<section bind:this={element} id="contact-us" class:intersecting>
  <div class="container">
    <form class="contact-form" bind:this={contactForm} on:submit|preventDefault={onSubmit}>
      <h2 class="title title-contact">contact us</h2>
      <input
        class="input input-name"
        type="text"
        placeholder="Name"
        bind:value={nameValue}
        required />
      <input
        class="input input-email"
        type="text"
        bind:value={email}
        placeholder="Email"
        use:validate={email}
        class:invalid={!isValid}
        required />
      <textarea
        class="input input-message"
        bind:value={textareaValue}
        placeholder="Message"
        required />
      <button disabled={!isValid} class="btn btn-submit" type="submit">submit</button>
    </form>
  </div>
</section>

<div class="popup-container" class:open={isOpen} on:click={onClose} bind:this={popUpBlock}>
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

<style lang="scss">
  @import '../scss/utilities/index';
  @import '../scss/molecules/contact-us';
  @import '../scss/molecules/popup';
</style>
