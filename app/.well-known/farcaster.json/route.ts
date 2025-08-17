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
  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    frame: withValidProperties({
      version: "1",
      name: "Outfitly",
      subtitle: "Your onchain wardrobe",
      description: "Discover, post, and collect outfits.",
      screenshotUrls: [
        `https://basedoutfits.vercel.app/screenshots/1.png`,
        `https://basedoutfits.vercel.app/screenshots/2.png`,
        `https://basedoutfits.vercel.app/screenshots/3.png`,
      ],
      imageUrl: `https://basedoutfits.vercel.app/hero.png`,
      buttonTitle: "View this outfit",
      iconUrl: `https://basedoutfits.vercel.app/icon.png`,
      splashImageUrl: `https://basedoutfits.vercel.app/splash.png`,
      splashBackgroundColor: "#ffffff",
      homeUrl: "https://basedoutfits.vercel.app",
      webhookUrl: `https://basedoutfits.vercel.app/api/webhook`,
      primaryCategory: "social",
      tags: ["fashion", "outfit", "wardrobe", "collect", "tip"],
      heroImageUrl: `https://basedoutfits.vercel.app/hero.png`,
      tagline: "Your onchain wardrobe",
      ogTitle: "Outfitly",
      ogDescription: "Discover, post, and collect outfits.",
      ogImageUrl: `https://basedoutfits.vercel.app/hero.png`,
      caseShareUrl: `https://basedoutfits.vercel.app`,
    }),
  };

  console.log(manifest);

  return Response.json(manifest);
}
