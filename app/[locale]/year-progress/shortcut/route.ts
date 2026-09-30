// Generates an UNSIGNED .shortcut (XML plist) that does:
//   Get Contents of URL  ->  Set Wallpaper
// with your wallpaper URL baked in.
//
// Important: iOS 15+ requires shortcuts to be SIGNED before they can be imported.
// This file therefore cannot be one-tap-installed on a modern iPhone as-is.
// Sign it first on a Mac:
//   shortcuts sign --mode anyone --input TimeGrid.shortcut --output TimeGrid-signed.shortcut
// then AirDrop the signed file to your phone. (Or build the 3-step shortcut by hand.)

export const dynamic = "force-dynamic";

function xmlEscape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const url = sp.get("url") || "";
  const name = sp.get("name") || "TimeGrid Wallpaper";

  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>WFWorkflowName</key>
  <string>${xmlEscape(name)}</string>
  <key>WFWorkflowClientVersion</key>
  <string>1200</string>
  <key>WFWorkflowMinimumClientVersion</key>
  <integer>900</integer>
  <key>WFWorkflowMinimumClientVersionString</key>
  <string>900</string>
  <key>WFWorkflowImportQuestions</key>
  <array/>
  <key>WFWorkflowTypes</key>
  <array>
    <string>NCWidget</string>
    <string>WatchKit</string>
  </array>
  <key>WFWorkflowInputContentItemClasses</key>
  <array>
    <string>WFAppStoreAppContentItem</string>
    <string>WFImageContentItem</string>
    <string>WFURLContentItem</string>
  </array>
  <key>WFWorkflowActions</key>
  <array>
    <dict>
      <key>WFWorkflowActionIdentifier</key>
      <string>is.workflow.actions.downloadurl</string>
      <key>WFWorkflowActionParameters</key>
      <dict>
        <key>WFURL</key>
        <string>${xmlEscape(url)}</string>
        <key>ShowHeaders</key>
        <false/>
      </dict>
    </dict>
    <dict>
      <key>WFWorkflowActionIdentifier</key>
      <string>is.workflow.actions.wallpaper.set</string>
      <key>WFWorkflowActionParameters</key>
      <dict>
        <key>WFShowWallpaperPreview</key>
        <false/>
      </dict>
    </dict>
  </array>
</dict>
</plist>
`;

  return new Response(plist, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${name.replace(/[^a-z0-9]+/gi, "-")}.shortcut"`,
      "Cache-Control": "no-store",
    },
  });
}
