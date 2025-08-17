function withValidProperties(
  properties: Record<string, undefined | string | string[]>,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    }),
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL;

  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    frame: withValidProperties({
      version: "1",
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE,
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      screenshotUrls: [
        `${URL}/screenshots/1.png`,
        `${URL}/screenshots/2.png`,
        `${URL}/screenshots/3.png`,
      ],
      imageUrl: `${URL}${process.env.NEXT_PUBLIC_APP_HERO_IMAGE}`,
      buttonTitle: "View this outfit",
      iconUrl: `${URL}${process.env.NEXT_PUBLIC_APP_ICON}`,
      splashImageUrl: `${URL}${process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE}`,
      splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY,
      tags: ["fashion", "outfit", "wardrobe", "collect", "tip"],
      heroImageUrl: `${URL}${process.env.NEXT_PUBLIC_APP_HERO_IMAGE}`,
      tagline: process.env.NEXT_PUBLIC_APP_TAGLINE,
      ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE,
      ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION,
      ogImageUrl: `${URL}${process.env.NEXT_PUBLIC_APP_OG_IMAGE}`,
      caseShareUrl: `${URL}`,
    }),
    noindex: process.env.NEXT_PUBLIC_NOINDEX === "true",
  };

  console.log(manifest);

  return Response.json(manifest);
}
