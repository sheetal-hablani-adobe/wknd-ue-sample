# Migrating a Site to AEM Universal Editor with EMA

**Placeholders used below:**
- `<org>`: GitHub organization or user
- `<repo>`: GitHub repository name, which is also the site name
- `<author-host>`: AEM author host, e.g. `author-pXXXXX-eYYYYY.adobeaemcloud.com`
- `<site-path>`: AEM site path, e.g. `/content/<repo>`

**GitHub Apps you'll need:**

| GitHub App | What it does | Install |
|---|---|---|
| **AEM Code Sync** | Deploys code from GitHub to Edge Delivery (`*.aem.page` / `*.aem.live`) | https://github.com/apps/aem-code-sync/installations/new |
| **AEM Code Connector** | Lets EMA push code to the GitHub repo | https://github.com/apps/aem-code-connector/installations/new |

## Part 1: Requirements

| # | Requirement | Links |
|---|---|---|
| 1 | **AEM as a Cloud Service program.** A sandbox is fine for trials and proofs of concept. It needs release 2026.4 or newer, with Sites and Edge Delivery Services. | Cloud Manager: https://experience.adobe.com/#/cloud-manager<br>Creating a sandbox program: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/using-cloud-manager/programs/creating-sandbox-programs<br>Managing environments: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/using-cloud-manager/manage-environments |
| 2 | **Adobe ID in an AEM Authors or Administrators product profile** for that environment. | Admin Console: https://adminconsole.adobe.com |
| 3 | **GitHub account** that can create repos in `<org>` and install GitHub Apps on them. Org repos may need the GitHub org owner's approval to install apps. | https://github.com |
| 4 | **Experience Modernization Agent (EMA) access** for the Adobe org. | Ask your Adobe account team. |

## Part 2: Set up GitHub and AEM (one time per site)

1. **Create the GitHub repo from the xwalk boilerplate.**
   - Boilerplate: https://github.com/adobe-rnd/aem-boilerplate-xwalk
   - Create a repo from the template: https://github.com/new?template_name=aem-boilerplate-xwalk&template_owner=adobe-rnd

2. **Install the AEM Code Sync GitHub App** on the new repo. Choose "Only select repositories".
   - App: https://github.com/apps/aem-code-sync
   - Install directly: https://github.com/apps/aem-code-sync/installations/new
   - Check: `https://main--<repo>--<org>.aem.page/head.html` should load.
   - **Note:** AEM Code Sync is what deploys the code to Edge Delivery. EMA needs a second GitHub App, the **AEM Code Connector**, to push code to the repo. You install it in Part 3, step 3.

3. **Point the content source at AEM author.** Edit `fstab.yaml` in the repo and commit the change:
   ```yaml
   mountpoints:
     /:
       url: "https://<author-host>/bin/franklin.delivery/<org>/<repo>/main"
       type: "markup"
       suffix: ".html"
   ```
   - Docs for sites that use the configuration service: https://www.aem.live/docs/config-service-setup

4. **Create the site in AEM from the Edge Delivery Services site template.**
   - Download the template `.zip` from the Assets section of the latest release: https://github.com/adobe-rnd/aem-boilerplate-xwalk/releases
   - In AEM, go to **Sites → Create → Site from template → Import**. Upload the `.zip`, then enter the GitHub repo URL `https://github.com/<org>/<repo>`.
   - Sites console: `https://<author-host>/ui#/aem/sites.html<site-path>`

5. **Add yourself as Admin** in the site config.
   - User Admin tool: https://tools.aem.live/tools/user-admin/index.html
   - Enter `<org>` and `<repo>`, click **Fetch users**, and make sure your email is listed as **Admin**. Do this before step 6, or you can lock yourself out of the site config.

6. **Give the AEM technical account the Config Admin role.** If you skip this, publishing fails with *"The technical account is missing the following permissions on `<org>/<repo>`: delete, delete-forced, list, read, write…"*
   - Find the technical account ID in AEM:
     1. Click **Adobe Experience Manager** in the top-left corner to open the navigation panel. Don't type the path into the search box; search only finds pages and assets.
     2. Go to **Tools** (the hammer icon) → **Cloud Services** → **Edge Delivery Services Configuration**.
     3. Select the site's configuration by clicking its checkbox, then click **Properties** → **Authentication** tab.
     4. Copy the **Technical Account ID**, which looks like `XXXXXXXX@techacct.adobe.com`.
   - In the User Admin tool, add that ID as a new user with the **Config Admin** role.
   - Wait 1–2 minutes for the change to take effect.
   - Docs (see "Setting the technical account"): https://www.aem.live/developer/ue-tutorial

7. **Test publishing.** In the Sites console, select **Index**, **Header (nav)** and **Footer** together and click **Quick Publish**.
   - Header and footer are separate pages, so they must be published too. Otherwise the site shows an empty header and footer.
   - Preview: `https://main--<repo>--<org>.aem.page/`
   - Live: `https://main--<repo>--<org>.aem.live/`
   - Publish status: `https://admin.hlx.page/status/<org>/<repo>/main/`

## Part 3: Connect EMA to the site

1. **Open EMA Settings** with the **gear icon** in the chat header.
2. **Switch site:** under **Project**, use **Switch site** to select the site you set up in Part 2 (`<org>/<repo>`). Every chat, preview and push then works against that site and repo.
3. **Install the AEM Code Connector GitHub App** on the repo. Choose "Only select repositories" and pick `<org>/<repo>`.
   - App: https://github.com/apps/aem-code-connector
   - Install directly: https://github.com/apps/aem-code-connector/installations/new
   - Without it, the **Code** option under the **Sync** button stays greyed out and EMA can't push code.
4. **Connect GitHub:** under **Credentials**, connect your GitHub account so EMA can read and push to `<org>/<repo>`.
5. **Grant permissions:** under **Agent Permissions**, enable:
   - **Git**, so EMA can commit and push code to the repo.
   - **Adobe credentials** ("Allow LLM to use my Adobe credentials for admin.hlx.page and Document Authoring uploads"). Turn this on only if you want EMA to update site settings, preview or publish for you.
6. **Return to the chat** with the back arrow.
7. **Check that push is available:** open the **Sync** button at the top right of the workspace.
   - If the **Code** item is clickable, pushing is set up.
   - If it's greyed out, hover over it to see the reason, such as the Code Connector app not being installed or GitHub not being connected. Follow the link it gives to fix it.

**Important:** never paste tokens or passwords into the chat. Credentials belong only in Settings.

## Part 4: Migrate with EMA

Each step starts with a plain request typed into the chat:

1. **Scope the site:** *"Run a site scope for https://source-site.com"*. This finds the URLs, groups pages into templates, lists the blocks and estimates the effort.
2. **Review the scope results:** *"Review scoping results"*. Rename, merge or split templates and blocks before building anything.
3. **Migrate pages:** *"Migrate these URLs: …"*, or migrate by template. This builds the blocks with their Universal Editor models, the import scripts and the page content.
   - How Universal Editor block models work: https://www.aem.live/developer/component-model-definitions
4. **Migrate the design:** *"Start design migration"*.
5. **Migrate the header and footer:** *"Migrate header from <URL>"* and *"Migrate footer from <URL>"*.
6. **Check against the original:** *"Critique page <URL>"* or *"Critique site"*.
7. **Push the code:** use **Sync → Code**, stage the files, write a commit message and push. This uses the **AEM Code Connector**. **AEM Code Sync** then deploys the code to `https://main--<repo>--<org>.aem.page/`.
8. **Upload the content to AEM author:** use **Sync → Content**.
   - Then open the pages in Universal Editor to review and author them: `https://experience.adobe.com/#/aem/editor/canvas/<author-host><site-path>/index.html`
9. **Publish** from Universal Editor (the **Publish** button) or the Sites console (**Quick Publish** or **Manage Publication**). Check the preview and live URLs afterwards.
10. **Go live:** set up the CDN and production domain.
    - Go-live checklist: https://www.aem.live/docs/go-live-checklist

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| Publish error: "technical account is missing … permissions" | Step 6 of Part 2 was skipped. Add the technical account as **Config Admin** in the User Admin tool. |
| Page loads but the header and footer are empty | **Header (nav)** and **Footer** weren't published. Quick Publish them. |
| **Sync → Code** is greyed out | Install the **AEM Code Connector** app on the repo (https://github.com/apps/aem-code-connector), or connect GitHub in Settings → Credentials. |
| Code was pushed but `.aem.page` doesn't update | Install the **AEM Code Sync** app on the repo (https://github.com/apps/aem-code-sync). |
| EMA is working on the wrong repo | Settings → Project → **Switch site**. |
| Searching "Tools → Cloud Services…" in AEM finds nothing | That box searches content. Open the menu with the **Adobe Experience Manager** label in the top-left corner instead. |

## Reference docs

- Getting started with Universal Editor and Edge Delivery: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/edge-dev-getting-started
- AEM authoring with Edge Delivery: https://www.aem.live/docs/aem-authoring
- Setting up AEM Sites as a content source: https://www.aem.live/developer/ue-tutorial
- Reusing one codebase across several sites: https://www.aem.live/developer/repoless-authoring
