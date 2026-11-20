with open(r"src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_hero = """      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#1C1C1C] py-14 px-4 bg-gradient-to-b from-[#141414] via-[#0E0E0E] to-[#0A0A0A]">
        <div className="max-w-5xl mx-auto text-center space-y-5">"""

new_hero = """      {/* Hero Section with 3D Visual Identity Artwork */}
      <section className="relative overflow-hidden border-b border-[#1C1C1C] py-16 px-4 bg-[#070707]">
        {/* 3D Background Artwork with Cyberpunk-Gold Overlays */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity pointer-events-none scale-105"
          style={{ backgroundImage: "url('/schematic-hero-3d.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/85 via-[#070707]/90 to-[#070707] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,196,0,0.1)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-5">"""

c_norm = content.replace("\r\n", "\n")
old_norm = old_hero.replace("\r\n", "\n")
new_norm = new_hero.replace("\r\n", "\n")

if old_norm in c_norm:
    c_norm = c_norm.replace(old_norm, new_norm, 1)
    with open(r"src/app/page.tsx", "w", encoding="utf-8") as f:
        f.write(c_norm)
    print("Home Hero updated successfully!")
else:
    print("Could not find old_hero in page.tsx")
