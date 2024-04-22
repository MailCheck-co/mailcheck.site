---
title: N8N Integration
date: 18.04.2024
readingTime: 2 min read
snippet: Guide on how to integrate Mailcheck using N8N
description: Guide on how to integrate Mailcheck using N8N
---

# **{title}**

## {snippet}

### Step 1:

Go to [https://app.mailcheck.co/dashboard/integration](https://app.mailcheck.co/dashboard/integration) and click “Connect”

![N8N integration step 1: Mailcheck integration page](./step-1.jpg?format=webp;jpg;png;avif&srcset&width=880)

### Step 2:

Add new block and find in search Google Sheets

![N8N integration step 2: Find Google Sheets](./step-2.jpg?format=webp;jpg;png;avif&srcset&width=880)

### Step 3:

Click on the new block Google Sheets, and fill out rows as showing in a screen. Create or choose your credential and copy spreadsheet ID from the file you would like to check. Finally click on the button Execute note.

![N8N integration step 3: Fill out the data and click “Execute”](./step-3.jpg?format=webp;jpg;png;avif&srcset&width=880)

### Step 4:

Add the block Mailcheck the same way you did it in step 2. You choose the right credentials, turn on expression mode instead of fixed, and you will see the new window for choosing, go to step 5.

![N8N integration step 4: Choose the right credentials](./step-4.jpg?format=webp;jpg;png;avif&srcset&width=880)

### Step 5:

You will see window Edit Expression, and you have to choose next node, and there will be green line in your expression and result, it means you are on right way. Close this editing. Click on the Execute node.

![N8N integration step 5: Choose next node](./step-5.jpg?format=webp;jpg;png;avif&srcset&width=880)

### Step 6:

Add new block, it is call “IF”

![N8N integration step 6: Add new block called “IF”](./step-6.jpg?format=webp;jpg;png;avif&srcset&width=880)

### Step 7:

Fill out the raw the same way as showing in this screen. Click on Value 1 raw, and turn on expression mode instead of fixed and you will see new window, move to Step 8.

![N8N integration step 7: Fill out the raw](./step-7.jpg?format=webp;jpg;png;avif&srcset&width=880)

### Step 8:

Choose node in the same way as showing in screen below, trustRate: 50. Again, green line says that you are going in the right way. Close the window and click to Execute node.

![N8N integration step 8: Choose node and trustRate](./step-8.jpg?format=webp;jpg;png;avif&srcset&width=880)

### Step 9:

Create new and the last block - find in the search SendGrid and add it in the block line. Fill out raws, with your current information. Click on Recipient Email raw, and turn on expression mode instead of fixed and the same thing with Value raw, you will see it in the next screen below. After that click on Execute node, and you nailed it.

![N8N integration step 8: Create new block SendGrid](./step-9.jpg?format=webp;jpg;png;avif&srcset&width=880)

![N8N integration step 8: Click on Execute](./step-10.jpg?format=webp;jpg;png;avif&srcset&width=880)

Congrats. Use it wise.

Please [let me know](mailto:integration@mailcheck.co) if you have any questions.

_Other popular integrations guides: [Mailchimp](/mailchimp-integration), [Woodpecker](/woodpecker-integration), [Zapier](/mailerlite-integration), [Make.com](/make-com-integration), [SendGrid](/sendgrid-integration), [Integromat](/integromat-integration)._

[_OUR BLOG_](/blog)
