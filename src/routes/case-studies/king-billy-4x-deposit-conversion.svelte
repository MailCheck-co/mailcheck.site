<script lang="ts" context="module">
  import pixels from '$lib/Case/pexels-photo.jpeg';
  import arrowRight from '$lib/Icons/lucide-ArrowRight-Outlined.svg?raw';
  import hands from '$lib/Icons/lucide-Handshake-Outlined.svg?raw';
  import alert from '$lib/Icons/lucide-TriangleAlert-Outlined.svg?raw';
  import lamp from '$lib/Icons/lucide-Lightbulb-Outlined.svg?raw';
  import chart from '$lib/Icons/lucide-ChartLine-Outlined.svg?raw';
  import info from '$lib/Icons/lucide-Info-Outlined.svg?raw';
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    const posts = await fetch('/blog.json').then((res: Response) => res.json());
    return {
      props: {
        posts
      }
    };
  }
</script>

<script lang="ts">
  import ContactUs from '$lib/ContactUs/index.svelte';
  import Seo from '$lib/Seo/index.svelte';
  import { websiteSchema, blogSchema } from '$utils/json-ld';
  import type { IPost } from '$utils/types';

  export let posts: IPost[];
  const title = 'Mailcheck <> King Billy Casino';
  const description =
    'Blog about building effective b2b and b2c email communications: guides and templates, trends & best practices, tips & tricks';
</script>

<Seo {description} {title} schemas={[websiteSchema, { ...blogSchema, name: title, description }]} />

<main class="blog-page" id="blog">
  <div class="container">
    <div class="content-block">
      <div class="content-item">
        <div class="flex-box">
          <div class="content-box">
            <div class="text-box">
              <h1 class="title">{title}</h1>
              <p class="text-thin">
                King Billy Casino, a leading iGaming platform, partnered with Mailcheck to
                dramatically enhance their player onboarding and communication. Discover how
                real-time email verification boosted their deliverability, reduced fraud, and
                optimized marketing ROI.
              </p>
            </div>
            <div class="button-box">
              <a class="btn btn-start btn-request" href="https://app.mailcheck.co/auth/login"
                >Get Started with Mailcheck
                <span>{@html arrowRight}</span>
              </a>
            </div>
          </div>
          <div class="image-box">
            <img src={pixels} alt="" />
          </div>
        </div>
      </div>
      <div class="content-item">
        <h3>{@html hands} The Client</h3>
        <p class="text-thin">
          King Billy Casino, a prominent online casino, offers a wide array of games to a global
          player base. Recognized for its commitment to a fair and secure gaming environment, King
          Billy Casino continually seeks innovative solutions to enhance player experience and
          operational efficiency. Facing the challenges of a dynamic digital landscape, they
          prioritize robust player acquisition and retention strategies, underpinned by reliable
          data management.
        </p>
      </div>
      <div class="content-item">
        <h3>{@html alert} Challenge</h3>
        <p class="text-thin">
          As a rapidly growing online casino, King Billy Casino encountered significant hurdles with
          data quality, particularly concerning player email addresses. These issues led to
          substantial operational inefficiencies and compromised player engagement:
        </p>
        <ul>
          <li>
            A high incidence of invalid, temporary, or fraudulent email addresses during
            registration, affecting over 18%of new sign-ups.
          </li>
          <li>
            Elevated email bounce rates, consistently exceeding 12% for critical communications such
            as welcome emails and promotional offers.
          </li>
          <li>
            Ineffective marketing campaigns due to poor deliverability, resulting in wasted budget
            and missed opportunities for player activation.
          </li>
          <li>
            Increased burden on customer support to resolve issues related to unreceived account
            verifications, bonus notifications, and withdrawal confirmations.
          </li>
        </ul>
      </div>
      <div class="content-item">
        <h3>{@html lamp} Solution</h3>
        <p class="text-thin">
          Mailcheck.co provided its advanced email verification API, seamlessly integrated into King
          Billy Casino's registration forms, player account management, and marketing automation
          platforms.
        </p>
        <h4>Implementation Details:</h4>
        <ul>
          <li>
            <b>Real-time Verification:</b>Every email address entered by a player is instantly
            validated against Mailcheck's comprehensive database.
          </li>
          <li>
            <b>Intelligent Autocorrection:</b> The API provides immediate suggestions for common typos
            and grammatical errors in email addresses, significantly improving data accuracy at the point
            of entry.
          </li>
          <li>
            <b>Disposable Email Detection:</b> Mailcheck identifies and flags disposable email addresses,
            preventing their use for registrations and combating bonus abuse.
          </li>
          <li>
            <b>Fraud Prevention:</b> Integration with Mailcheck's risk scoring system helps to identify
            suspicious email patterns associated with potential fraudulent activities, bolstering the
            casino's security measures.
          </li>
          <li>
            <b>Seamless Integration:</b> The API was easily integrated with existing systems, requiring
            minimal development effort and ensuring a smooth transition without disrupting player experience.
          </li>
        </ul>
      </div>
      <div class="content-item">
        <h3>{@html chart} Results</h3>
        <p class="text-thin">
          The integration of Mailcheck.co's API delivered a transformative impact on King Billy
          Casino's operations, significantly improving data hygiene, player engagement, and
          financial performance.
        </p>
        <ul>
          <li>
            An astounding <span>99%</span> reduction in invalid and disposable email registrations.
          </li>
          <li>
            Email bounce rates plummeted from over 12% to a remarkable <span>0.8%</span>, ensuring
            critical communications reach players effectively.
          </li>
          <li>
            A significant <span>30%</span> increase in player activation rates due to improved deliverability
            of welcome series and initial bonus offers.
          </li>
          <li>
            Reduced customer support tickets related to email issues by <span>40%</span>, freeing up
            resources for more complex player inquiries.
          </li>
          <li>
            Enhanced protection against bonus abuse and fraudulent accounts, contributing to a more
            secure and trustworthy gaming environment.
          </li>
        </ul>
      </div>
      <div class="content-item marked">
        <h3>Client Testimonial</h3>
        <div class="italic-box">
          "Mailcheck.co has been a game-changer for King Billy Casino. The precision and real-time
          capabilities of their API have not only cleaned up our player database but also
          fundamentally improved our ability to connect with our players. It's a robust solution
          that delivers tangible results, allowing us to focus on providing an exceptional gaming
          experience."
        </div>
      </div>
      <div class="content-item">
        <h3>{@html info} Conclusion</h3>
        <p class="text-thin">
          Mailcheck.co's partnership with King Billy Casino exemplifies how a targeted,
          high-precision email verification solution can yield profound improvements across critical
          business functions. By ensuring the integrity of player data from the outset, King Billy
          Casino not only optimized its marketing spend and operational efficiency but also
          significantly strengthened its relationship with players through reliable communication
          and enhanced security.
        </p>
        <p class="text-thin">
          This case study underscores Mailcheck.co's commitment to empowering businesses with the
          tools needed to combat data decay and foster robust, trustworthy digital interactions. The
          success at King Billy Casino serves as a testament to the Mailcheck API's effectiveness in
          delivering measurable value in the highly competitive iGaming sector.
        </p>
      </div>
      <div class="content-item">
        <h3>{@html info} Note about Mailcheck.co installation at King Billy Casino</h3>
        <p class="text-thin">
          The Mailcheck.co email validation API was strategically integrated at several key
          touchpoints within the King Billy Casino ecosystem to maximize its impact on data quality
          and player experience:
        </p>
        <ul>
          <li>
            <b>Registration Forms:</b> Real-time validation occurs immediately when a new player submits
            their email address, preventing invalid entries from entering the database.
          </li>
          <li>
            <b>Player Account Profile Updates:</b> When players update their email address in their account
            settings, the API re-validates the new entry to maintain data accuracy.
          </li>
          <li>
            <b>Marketing Automation Flows:</b> Prior to sending out welcome emails, promotional offers,
            or important account notifications, Mailcheck performs a final check to ensure high deliverability
            rates.
          </li>
          <li>
            <b>API-Level Integration:</b> The integration was done at the API level, allowing for seamless
            communication between King Billy Casino's backend systems and Mailcheck's robust validation
            engine, ensuring minimal disruption and maximum efficiency.
          </li>
        </ul>
      </div>
    </div>
  </div>
</main>

<ContactUs />

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap');
  .content-item {
    padding: 100px 0;
    position: relative;

    p {
      text-align: left;
    }
    &:nth-child(odd) {
      &::before {
        content: '';
        display: block;
        width: 100vw;
        height: 100%;
        background-color: #171a1fff;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: -1;
      }
    }
    &.marked {
      background: #021d22ff;
      &::before {
        content: '';
        display: block;
        width: 100vw;
        height: 100%;
        background-color: #021d22ff;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: -1;
      }
    }
  }
  .flex-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 64px;
  }
  .content-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    h1 {
      text-align: left;
    }
    p {
      text-align: left;
    }
  }
  .button-box {
    .btn-start {
      display: flex;
      gap: 24px;
      z-index: 1;
      color: var(--primary-white);
      background-color: var(--primary-accent);
      border: none;

      &:hover {
        color: var(--primary-accent);
        text-decoration: none;
        background-color: var(--primary-white);
      }

      &:active {
        color: var(--primary-white);
        background-color: var(--primary-accent);
      }
    }
    .btn-request {
      padding: var(--size-10) var(--size-20);
      font-size: calc(var(--size-16) - 20%);
    }
  }
  .image-box {
    flex: 1;
    border-radius: 4px;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
    }
  }
  h3 {
    display: flex;
    align-items: center;
    gap: 16px;
    color: var(--primary-white);
    font-size: var(--size-36);
    font-weight: var(--weight-700);
    :global(svg) {
      color: #0a8ca9ff;
    }
  }

  h4 {
    font-size: var(--size-24);
    line-height: 32px;
    color: var(--primary-white) !important;
    font-weight: var(--weight-600);
  }

  ul {
    line-height: var ↳ 1.5rem ↳ 24px (--size-24);
    margin: 0 0 0 var(--size-24);
    padding: 0 0 0 var(--size-24);
    li {
      color: var(--primary-white);
      margin: 0 0 0.5em;
      span {
        color: var(--primary-accent);
        font-size: var(--size-36);
        font-weight: var(--weight-900);
        letter-spacing: var(--size-2);
        line-height: var(--size-42);
        opacity: 0.91;
      }
    }
  }

  .italic-box {
    width: 100%;
    max-width: 768px;
    margin: 0 auto;
    font-family: 'Raleway', sans-serif;
    color: var(--primary-white);
    font-size: 36px;
    font-weight: 600;
    text-align: center;
  }

  @media (max-width: 768px) {
    .content-item {
      padding: 16px;
      border-radius: 4px;
      background-color: #171a1fff;
      overflow: hidden;
      margin-bottom: 24px;
      &:first-child {
        background-color: #021d22ff;
      }
      &::before {
        display: none;
      }
    }
    .flex-box {
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .content-box {
      display: contents;
      h1 {
        text-align: center;
      }
      p {
        text-align: center;
      }
    }
    .button-box {
      order: 1;
    }
  }
  // .blog-page {
  //   position: relative;
  //   z-index: 1;

  //   .container {
  //     .content-block {
  //       .article {
  //         &-title {
  //           width: 100%;
  //           height: auto;
  //           margin: var(--size-20) auto 0;
  //           color: var(--primary-white);
  //           font-weight: var(--weight-500);
  //           font-size: var(--size-24);
  //           line-height: 30px;
  //           letter-spacing: 1.6px;
  //           text-align: left;
  //           text-transform: uppercase;
  //           text-decoration: none;

  //           &:hover {
  //             color: var(--primary-white);
  //             text-decoration: underline;
  //           }
  //         }

  //         &-date {
  //           width: 100%;
  //           margin: 0 0 10px;
  //           color: var(--primary-white);
  //           font-weight: var(--weight-300);
  //           font-size: var(--size-14);
  //           line-height: var(--size-20);
  //           letter-spacing: var(--letter-spacing);
  //           text-align: left;
  //           opacity: 0.5;
  //         }

  //         &-snippet {
  //           margin: 0 0 15px;
  //           color: var(--primary-white);
  //           font-weight: var(--weight-300);
  //           font-size: var(--size-16);
  //           line-height: 24px;
  //           letter-spacing: var(--letter-spacing);
  //           text-align: left;
  //           text-indent: initial;

  //           .text-thin-link {
  //             color: var(--color-link);
  //             text-decoration: none;

  //             &:hover {
  //               text-decoration: underline;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
</style>
