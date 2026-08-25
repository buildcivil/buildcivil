"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronRight, Menu, MessageCircle, X } from "lucide-react";
import type { HeaderSettings } from "@/lib/site-settings-defaults";

type NavbarClientProps = {
	settings: HeaderSettings;
};

export default function NavbarClient({ settings }: NavbarClientProps) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const pathname = usePathname();
	const navLinks = useMemo(
		() => settings.navLinks.filter((link) => link.visible),
		[settings.navLinks],
	);
	const cta = settings.cta;
	const mobileTopBar = settings.mobileTopBar;
	const showMobileTopBar = Boolean(mobileTopBar?.visible);

	const shellClass =
		"border-[#73A5CA]/12 bg-white text-[#1c1712] shadow-[0_12px_28px_rgba(28,23,18,0.08)]";

	const linkClass =
		"whitespace-nowrap font-display text-sm uppercase tracking-[0.12em] text-[#1c1712]/82 transition-colors duration-300 hover:text-[#E87F24] xl:text-[0.95rem] 2xl:text-base";

	const brandPrimary = "text-[#1c1712]";
	const brandAccent = "text-[#E87F24]";
	const buttonClass =
		"btn-primary hidden min-w-[140px] shrink-0 items-center justify-center gap-2 px-4 py-3 text-sm font-medium tracking-[0.08em] transition-all duration-300 hover:shadow-[0_10px_24px_rgba(232,127,36,0.2)] xl:inline-flex 2xl:min-w-[154px] 2xl:gap-3 2xl:px-5 2xl:tracking-[0.1em]";
	const desktopLogoWidth = scaleDimension(
		resolveDimension(settings.brand.desktopWidth, 180, 96, 360),
		1.35,
		420,
	);
	const tabletLogoWidth = scaleDimension(
		resolveDimension(settings.brand.tabletWidth, 150, 92, 280),
		1.5,
		420,
	);
	const mobileLogoWidth = scaleDimension(
		resolveDimension(settings.brand.mobileWidth, 126, 88, 220),
		1.5,
		330,
	);
	const drawerLogoWidth = Math.min(tabletLogoWidth, 190);
	const markSize = resolveDimension(settings.brand.markSize, 56, 40, 96);
	const primaryColor = settings.brand.primaryColor || "#1c1712";
	const accentColor = settings.brand.accentColor || "#E87F24";
	const markBackgroundColor = settings.brand.markBackgroundColor || "#FFC81E";

	useEffect(() => {
		setMobileOpen(false);
	}, [pathname]);

	useEffect(() => {
		if (!mobileOpen) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		function closeOnEscape(event: KeyboardEvent) {
			if (event.key === "Escape") setMobileOpen(false);
		}

		window.addEventListener("keydown", closeOnEscape);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", closeOnEscape);
		};
	}, [mobileOpen]);

	return (
		<>
			{showMobileTopBar ? (
				<div className="fixed left-0 right-0 top-0 z-50">
					<div
						className="flex min-h-11 w-full items-center justify-between gap-3 border-b border-[#73A5CA]/12 px-4 py-1 text-[13px] font-medium shadow-[0_8px_20px_rgba(28,23,18,0.08)] sm:px-6 sm:text-sm lg:px-10 xl:min-h-12 xl:text-base"
						style={{
							backgroundColor: mobileTopBar.backgroundColor || "#ffffff",
							color: mobileTopBar.textColor || "#1c1712",
						}}
					>
						{mobileTopBar.locationText ? (
							<span className="min-w-0 truncate text-left leading-tight">
								{mobileTopBar.locationText}
							</span>
						) : (
							<span />
						)}
						{mobileTopBar.phoneLabel ? (
							<a
								href={
									mobileTopBar.phoneHref || `tel:${mobileTopBar.phoneLabel.replace(/[^\d+]/g, "")}`
								}
								className="ml-auto inline-flex shrink-0 items-center justify-end gap-1.5 text-right font-black leading-tight transition-opacity hover:opacity-75"
							>
								<MessageCircle size={14} style={{ color: mobileTopBar.accentColor || "#25D366" }} />
								<span>{mobileTopBar.phoneLabel}</span>
							</a>
						) : null}
					</div>
				</div>
			) : null}
			<nav
				className={`fixed left-0 right-0 z-50 px-0 pt-0 transition-all duration-500 ${showMobileTopBar ? "top-11 xl:top-12" : "top-0"}`}
			>
				<div
					className={`mx-auto flex w-full max-w-none items-center justify-between gap-4 border-b px-3 py-2.5 transition-all duration-500 sm:px-5 md:px-6 lg:px-8 xl:gap-6 xl:px-10 2xl:px-12 ${shellClass}`}
				>
					<a href={settings.brand.href} className="group flex shrink-0 items-center gap-3">
						{settings.brand.showImageLogo && settings.brand.logoUrl ? (
							<>
								<span
									className="relative block h-[4.5rem] overflow-hidden xl:hidden"
									style={{ width: mobileLogoWidth }}
								>
									<Image
										src={settings.brand.logoUrl}
										alt={settings.brand.logoAlt || "BuildCivil Constructions"}
										fill
										className="object-contain object-left"
										sizes={`${mobileLogoWidth}px`}
										priority
										unoptimized
									/>
								</span>
								<span
									className="relative hidden h-[5.25rem] overflow-hidden xl:block"
									style={{ width: desktopLogoWidth }}
								>
									<Image
										src={settings.brand.logoUrl}
										alt={settings.brand.logoAlt || "BuildCivil Constructions"}
										fill
										className="object-contain object-left"
										sizes={`${desktopLogoWidth}px`}
										priority
										unoptimized
									/>
								</span>
							</>
						) : (
							<span className="hidden xl:flex items-center gap-3">
								<span
									className="flex items-center justify-center rounded-xl border border-[#FFC81E]/35 bg-white/14 shadow-[0_0_0_1px_rgba(255,200,30,0.08)_inset]"
									style={{
										width: markSize,
										height: markSize,
										backgroundColor: markBackgroundColor,
									}}
								>
									<span className="flex flex-col items-start leading-[0.78]">
										<span
											className={`font-display text-[1.45rem] font-black uppercase tracking-[-0.08em] lg:text-[1.72rem] ${brandPrimary}`}
											style={{ color: primaryColor }}
										>
											{settings.brand.markTop}
										</span>
										<span
											className={`font-display text-[1.05rem] font-black uppercase tracking-[-0.06em] lg:text-[1.28rem] ${brandAccent}`}
											style={{ color: accentColor }}
										>
											{settings.brand.markBottom}
										</span>
									</span>
								</span>
								<span className="flex flex-col leading-[0.78]">
									<span
										className={`font-display text-[1.8rem] font-black uppercase tracking-tight lg:text-[2.3rem] ${brandPrimary}`}
										style={{ color: primaryColor }}
									>
										{settings.brand.wordTop}
									</span>
									<span
										className={`font-display text-[1.8rem] font-black uppercase tracking-tight lg:text-[2.3rem] ${brandAccent}`}
										style={{ color: accentColor }}
									>
										{settings.brand.wordBottom}
									</span>
								</span>
							</span>
						)}
						{!settings.brand.showImageLogo || !settings.brand.logoUrl ? (
							<span
								className="flex xl:hidden flex-col font-display text-2xl font-black uppercase tracking-tight leading-none"
								style={{ color: primaryColor }}
							>
								<span style={{ color: accentColor }}>{settings.brand.mobileTop}</span>
								<span>{settings.brand.mobileBottom}</span>
							</span>
						) : null}
					</a>

					<div className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
						<div className="flex flex-nowrap items-center justify-center gap-4 xl:gap-5 2xl:gap-8">
							{navLinks.map((link) => (
								<a key={link.id} href={link.href} className={linkClass}>
									{link.label}
								</a>
							))}
						</div>
					</div>

					{cta.visible ? (
						<a href={cta.href} className={buttonClass}>
							{cta.label}
							<ArrowRight size={18} strokeWidth={2.3} />
						</a>
					) : (
						<div className="hidden min-w-[140px] shrink-0 xl:block 2xl:min-w-[154px]" />
					)}

					<button
						onClick={() => setMobileOpen(!mobileOpen)}
						className="rounded-full border border-[#73A5CA]/20 bg-[#FEFDDF]/85 p-2.5 text-[#1c1712] transition-colors duration-300 xl:hidden"
						aria-label="Toggle mobile menu"
					>
						{mobileOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</nav>

			{mobileOpen ? (
				<div className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-white text-[#1c1712] transition-all duration-300 xl:hidden">
					<div className="flex min-h-[128px] items-center justify-between gap-5 border-b border-[#1c1712]/10 px-8 py-7 sm:min-h-[150px] sm:px-10">
						<a
							href={settings.brand.href}
							onClick={() => setMobileOpen(false)}
							className="flex min-w-0 items-center gap-4"
						>
							{settings.brand.showImageLogo && settings.brand.logoUrl ? (
								<span
									className="relative block h-20 shrink-0 overflow-hidden"
									style={{ width: drawerLogoWidth }}
								>
									<Image
										src={settings.brand.logoUrl}
										alt={settings.brand.logoAlt || "BuildCivil Constructions"}
										fill
										className="object-contain object-left"
										sizes={`${drawerLogoWidth}px`}
										unoptimized
									/>
								</span>
							) : (
								<>
									<span
										className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#FFC81E]/35"
										style={{ backgroundColor: markBackgroundColor }}
									>
										<span
											className="font-display text-lg font-black uppercase tracking-[-0.08em]"
											style={{ color: primaryColor }}
										>
											{settings.brand.markTop}
										</span>
									</span>
									<span className="flex min-w-0 flex-col font-display text-[1.65rem] font-black uppercase leading-[0.95] tracking-[0.05em]">
										<span className="truncate" style={{ color: primaryColor }}>
											{settings.brand.mobileTop || settings.brand.wordTop}
										</span>
										<span className="truncate" style={{ color: primaryColor }}>
											{settings.brand.mobileBottom || settings.brand.wordBottom}
										</span>
									</span>
								</>
							)}
						</a>
						<button
							type="button"
							onClick={() => setMobileOpen(false)}
							className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[#1c1712]/72 transition hover:bg-[#1c1712]/5 hover:text-[#1c1712]"
							aria-label="Close mobile menu"
						>
							<X size={30} strokeWidth={2.2} />
						</button>
					</div>

					<div className="flex flex-1 flex-col px-5 py-7 sm:px-10">
						<div className="border-y border-[#1c1712]/10">
							{navLinks.map((link) => (
								<a
									key={link.id}
									href={link.href}
									onClick={() => setMobileOpen(false)}
									className="group flex items-center justify-between gap-4 border-b border-[#1c1712]/10 px-3 py-6 text-[1.55rem] font-black tracking-[-0.04em] text-[#242424] transition-colors last:border-b-0 hover:text-[#E87F24] sm:text-[1.9rem]"
								>
									<span>{link.label}</span>
									<ChevronRight
										size={28}
										className="text-[#1c1712]/45 transition group-hover:translate-x-1 group-hover:text-[#E87F24]"
									/>
								</a>
							))}
						</div>

						<div className="mt-auto pt-8">
							{cta.visible ? (
								<a
									href={cta.href}
									onClick={() => setMobileOpen(false)}
									className="flex w-full items-center justify-center gap-4 rounded-full bg-[#ff7a12] px-6 py-5 text-center text-[1.15rem] font-black uppercase tracking-[0.08em] text-white shadow-[0_18px_36px_rgba(255,122,18,0.2)] transition hover:bg-[#E87F24] sm:text-[1.35rem]"
								>
									{cta.label}
									<ArrowRight size={24} />
								</a>
							) : null}
						</div>
					</div>
				</div>
			) : null}
			{/* Fixed header is out of document flow; reserve 30px so page content clears it site-wide */}
			<div className="h-[50px]" aria-hidden="true" />
		</>
	);
}

function resolveDimension(value: string | undefined, fallback: number, min: number, max: number) {
	const parsed = Number.parseFloat(value || "");
	if (!Number.isFinite(parsed)) return fallback;
	return Math.min(max, Math.max(min, parsed));
}

function scaleDimension(value: number, scale: number, max: number) {
	return Math.min(max, Math.round(value * scale));
}
