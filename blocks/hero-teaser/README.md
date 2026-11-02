# hero-teaser

Custom **hero** block. Purpose: single promoted story teaser (Next Adventures) on the home page.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: row 1 = image (with alt), row 2 = rich text with h2 title, description paragraph and CTA link.

## Supported variations

No variations.

## Universal Editor fields

Model id `hero-teaser` (separate from the `hero` model):

- `image` (reference): the full-width photo
- `imageAlt` (text): alt text for the photo
- `text` (richtext): h2 title, description paragraph, and the CTA link in its own paragraph
