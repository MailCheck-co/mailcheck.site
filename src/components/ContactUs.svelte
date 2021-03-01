<style lang="scss">
  @import "../scss/utilities/index";
  @import "../scss/molecules/contact-us";
  @import "../scss/molecules/popup";
</style>

<script>
  import { writable } from "svelte/store";
  import IntersectionObserver from "svelte-intersection-observer";

  function buildValidator(validators) {
    return function validate(value, dirty) {
      if (!validators || validators.length === 0) {
        return { dirty, valid: true };
      }

      const failing = validators.find((v) => v(value) !== true);

      return {
        dirty,
        valid: !failing,
        message: failing && failing(value),
      };
    };
  }

  function createFieldValidator(...validators) {
    const { subscribe, set } = writable({
      dirty: false,
      valid: false,
      message: null,
    });
    const validator = buildValidator(validators);

    function action(node, binding) {
      function validate(value, dirty) {
        const result = validator(value, dirty);
        set(result);
      }

      validate(binding, false);

      return {
        update(value) {
          validate(value, true);
        },
      };
    }

    return [{ subscribe }, action];
  }

  function emailValidator() {
    return function email(value) {
      return (
        (value &&
          !!value.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )) ||
        "Please enter a valid email"
      );
    };
  }

  function requiredValidator() {
    return function required(value) {
      return (
        (value !== undefined && value !== null && value !== "") ||
        "This field is required"
      );
    };
  }

  const [validity, validate] = createFieldValidator(
    requiredValidator(),
    emailValidator()
  );

  let email = null;
  let once = false;
  let element;
  let intersecting;
  let isOpen = false;
  let isError = false;
  let contactForm, popUpBlock;
  const onClose = () => {
    isOpen = false;
    isError = false;
    document.body.classList.remove("fixed");
  };
  const onIntersect = () => {
    if (!once) {
      once = true;
    }
  };
  const onSubmit = async() => {
    const nameValue = contactForm.querySelector(".input-name").value;
    const mailValue = contactForm.querySelector(".input-email").value;
    const textareaValue = contactForm.querySelector(".input-message").value;
    const referrerValue = document.referrer;
    const data = {
      name: nameValue,
      email: mailValue,
      subject: textareaValue,
      referrer: referrerValue,
    };

        try {
            await fetch("/api/sendMail", {
            method: "POST",
            body: JSON.stringify(data),
            });
            isOpen = true;
            contactForm.reset();
        } catch (e) {
            isOpen = true;
            isError = true;
            console.error(e);
        }

    document.body.classList.add("fixed");
    window.dataLayer.push({
      eventCategory: "site",
      eventAction: "contactform",
      eventLabel: "submit",
      eventValue: "",
      event: "gaEvent",
    });
  };
</script>

<IntersectionObserver
  threshold="{0.2}"
  element="{element}"
  bind:intersecting
  on:observe="{onIntersect}">
  <section
    bind:this="{element}"
    class:intersecting="{() => !once}"
    class="contact-us"
    id="contact-us">
    <div class="container">
      <form
        class="contact-form"
        bind:this="{contactForm}"
        on:submit|preventDefault="{onSubmit}">
        <h2 class="title title-contact">contact us</h2>
        <input
          class="input input-name"
          type="text"
          placeholder="Name"
          required />
        <input
          class="input input-email"
          type="text"
          bind:value="{email}"
          placeholder="Email"
          class:invalid="{!$validity.valid}"
          use:validate="{email}" />

        <textarea class="input input-message" placeholder="Message" required
        ></textarea>
        <button
          disabled="{!$validity.valid || !$validity.dirty}"
          class="btn btn-submit"
          type="submit">submit</button>
      </form>
    </div>
  </section>
</IntersectionObserver>

<div
  class="popup-container"
  class:open="{isOpen}"
  on:click="{onClose}"
  bind:this="{popUpBlock}">
  <div class="popup" class:open="{isOpen}">
    <span class="popup-close success"></span>
    <span class="popup-thanks">Thanks for filling out our form!</span>
    <p class="popup-text">
      We will look over your message and get back to you by tomorrow. Your
      friends at MailCheck!
    </p>
  </div>
  <div class="popup" class:open="{isError && isOpen}">
    <span class="popup-close error"></span>
    <span class="popup-thanks">Something went wrong!</span>
    <p class="popup-text">Please try again later</p>
  </div>
</div>
