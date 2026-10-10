import React, { useState } from 'react';
import { FiCopy, FiCheck, FiPlay, FiStar, FiEye, FiZap, FiLayers } from 'react-icons/fi';
import BrandLogo from '../../common/BrandLogo';
import styles from './BrandDesignLab.module.css';

/**
 * BrandDesignLab — Interactive Identity & Color System Playground
 * Directly reproduces the official Chinmay Wadhwa Brand Architecture:
 * - 01 The Signature Mark (Primary Logo)
 * - 02 The Coded Mark (Alternate Logo)
 * - 03 The Flow Mark (Interactive Logo)
 * - 4 Interaction States: IDLE, HOVER, CLICK, LOADING
 * - 4 Brand Palette Tokens: Sage (#CDE8D5), Lavender (#D7C8FF), Peach (#FFCDB2), Butter (#FFE6BF)
 * - Lockup variations & Navbar live preview
 */
const BrandDesignLab = () => {
  const [selectedConcept, setSelectedConcept] = useState('signature'); // 'signature' | 'coded' | 'flow'
  const [activeState, setActiveState] = useState('auto'); // 'auto' | 'idle' | 'hover' | 'click' | 'loading'
  const [lockup, setLockup] = useState('horizontal'); // 'mark' | 'horizontal' | 'vertical'
  const [containerTheme, setContainerTheme] = useState('glass'); // 'glass' | 'dark' | 'circular' | 'light'
  const [copiedHex, setCopiedHex] = useState(null);

  const brandColors = [
    { name: 'Sage', hex: '#CDE8D5', role: 'Interface & Frontend Highlights', textDark: true },
    { name: 'Lavender', hex: '#D7C8FF', role: 'Primary Brand Glow & Systems', textDark: true },
    { name: 'Peach', hex: '#FFCDB2', role: 'Secondary Accents & Warmth', textDark: true },
    { name: 'Butter', hex: '#FFE6BF', role: 'Illuminated Nodes & Halos', textDark: true },
  ];

  const concepts = [
    {
      id: 'signature',
      num: '01',
      title: 'THE SIGNATURE MARK',
      subtitle: 'Primary Logo',
      traits: ['MODERN', 'MINIMAL', 'ARCHITECTURAL', 'CONNECTED', 'PERSONAL', 'MEMORABLE'],
      desc: 'Continuous ribbon monogram forming CW, with elevated right arm terminating in an illuminated glowing node orb.',
    },
    {
      id: 'coded',
      num: '02',
      title: 'THE CODED MARK',
      subtitle: 'Alternate Logo',
      traits: ['TECHNICAL', 'BOLD', 'DEVELOPER-FOCUSED', 'CLEAN', 'SCALABLE', 'VERSATILE'],
      desc: 'Precision hexagonal code brackets enclosing a central pulse dot and stylized angular W geometry.',
    },
    {
      id: 'flow',
      num: '03',
      title: 'THE FLOW MARK',
      subtitle: 'Interactive Logo',
      traits: ['DYNAMIC', 'FLOW-BASED', 'SYSTEMS DRIVEN', 'INTERACTIVE', 'UNIQUE', 'PREMIUM'],
      desc: 'Organic continuous wave bridge curving over an illuminated node, joining C and W into a unified circuit.',
    },
  ];

  const handleCopyColor = (hex) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 2000);
    }
  };

  const currentConceptData = concepts.find((c) => c.id === selectedConcept) || concepts[0];

  return (
    <div className={styles.labContainer}>
      {/* ─── Header & Concept Switcher ─── */}
      <div className={styles.headerBlock}>
        <div className={styles.titleRow}>
          <span className={styles.eyebrowTag}>(BRAND IDENTITY &amp; DESIGN SYSTEM)</span>
          <h3 className={styles.mainTitle}>CHINMAY WADHWA — IDENTITY SYSTEM</h3>
          <p className={styles.mainSubtitle}>
            Engineered brand architecture featuring vector geometry, interactive states,
            and an editorial pastel palette on deep obsidian surfaces.
          </p>
        </div>

        {/* 3 Concept Selectors */}
        <div className={styles.conceptTabs}>
          {concepts.map((c) => {
            const isSelected = selectedConcept === c.id;
            return (
              <button
                key={c.id}
                className={`${styles.conceptCard} ${isSelected ? styles.conceptCardActive : ''}`}
                onClick={() => setSelectedConcept(c.id)}
              >
                <div className={styles.conceptMeta}>
                  <span className={styles.conceptNum}>{c.num}</span>
                  <span className={styles.conceptRole}>{c.subtitle}</span>
                </div>
                <h4 className={styles.conceptTitle}>{c.title}</h4>
                <div className={styles.conceptTraits}>
                  {c.traits.slice(0, 3).map((t) => (
                    <span key={t} className={styles.traitTag}>{t}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Live Interactive Stage & State Controller ─── */}
      <div className={styles.stageGrid}>
        {/* Stage Canvas */}
        <div className={styles.canvasArea}>
          <div className={styles.canvasToolbar}>
            <div className={styles.toolbarLeft}>
              <span className={styles.activeConceptLabel}>
                {currentConceptData.num} · {currentConceptData.title}
              </span>
              <span className={styles.stateIndicatorPill}>
                State: <strong>{activeState.toUpperCase()}</strong>
              </span>
            </div>

            {/* Container Theme Switcher */}
            <div className={styles.themeToggleGroup}>
              {['glass', 'dark', 'circular', 'light'].map((t) => (
                <button
                  key={t}
                  className={`${styles.themeToggleBtn} ${containerTheme === t ? styles.themeToggleActive : ''}`}
                  onClick={() => setContainerTheme(t)}
                  title={`Container Style: ${t}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Central Logo Display */}
          <div className={styles.stageDisplayArea}>
            <div className={styles.ambientHaloBackdrop} />

            <div className={styles.logoRenderer}>
              <BrandLogo
                concept={selectedConcept}
                lockup={lockup}
                variant={containerTheme}
                state={activeState}
                size="xl"
                showText={lockup !== 'mark'}
                showSubtitle={true}
                interactive={true}
              />
            </div>

            <p className={styles.conceptDescription}>
              {currentConceptData.desc}
            </p>
          </div>

          {/* Interaction States Controller Bar */}
          <div className={styles.statesBar}>
            <div className={styles.statesLabel}>
              <FiStar size={13} />
              <span>INTERACTION STATES</span>
            </div>
            <div className={styles.stateBtnGroup}>
              {[
                { id: 'auto', label: 'AUTO (Interactive)', icon: FiZap },
                { id: 'idle', label: 'IDLE (Clean)', icon: FiEye },
                { id: 'hover', label: 'HOVER (Subtle Glow)', icon: FiStar },
                { id: 'click', label: 'CLICK (Node Travels)', icon: FiPlay },
                { id: 'loading', label: 'LOADING (Draw In)', icon: FiLayers },
              ].map((s) => {
                const IconComponent = s.icon;
                const isCurrent = activeState === s.id;
                return (
                  <button
                    key={s.id}
                    className={`${styles.stateBtn} ${isCurrent ? styles.stateBtnActive : ''}`}
                    onClick={() => setActiveState(s.id)}
                  >
                    <IconComponent size={12} />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lockup Format Toggles */}
          <div className={styles.lockupBar}>
            <span className={styles.lockupLabel}>LOCKUP FORMAT:</span>
            <div className={styles.lockupGroup}>
              {[
                { id: 'mark', label: 'Mark Only' },
                { id: 'horizontal', label: 'Horizontal Lockup' },
                { id: 'vertical', label: 'Vertical Lockup' },
              ].map((l) => (
                <button
                  key={l.id}
                  className={`${styles.lockupBtn} ${lockup === l.id ? styles.lockupBtnActive : ''}`}
                  onClick={() => setLockup(l.id)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Sidebar: Color System & Contextual Previews ─── */}
        <div className={styles.sidebarArea}>
          {/* Color System Palette Card */}
          <div className={styles.colorSystemCard}>
            <div className={styles.cardHeader}>
              <h4 className={styles.cardTitle}>COLOR SYSTEM</h4>
              <span className={styles.cardBadge}>BRAND TOKENS</span>
            </div>

            <div className={styles.colorList}>
              {brandColors.map((color) => {
                const isCopied = copiedHex === color.hex;
                return (
                  <div
                    key={color.name}
                    className={styles.colorRow}
                    onClick={() => handleCopyColor(color.hex)}
                    title={`Click to copy ${color.hex}`}
                  >
                    <div className={styles.colorPreview} style={{ backgroundColor: color.hex }}>
                      <span className={styles.colorDotGlow} style={{ backgroundColor: color.hex }} />
                    </div>

                    <div className={styles.colorInfo}>
                      <div className={styles.colorTop}>
                        <span className={styles.colorName}>{color.name}</span>
                        <code className={styles.colorHex}>{color.hex}</code>
                      </div>
                      <span className={styles.colorRole}>{color.role}</span>
                    </div>

                    <button className={styles.copyBtn} aria-label={`Copy ${color.hex}`}>
                      {isCopied ? <FiCheck size={13} className={styles.checkIcon} /> : <FiCopy size={13} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navbar Usage Mockup Card */}
          <div className={styles.navbarUsageCard}>
            <div className={styles.cardHeader}>
              <h4 className={styles.cardTitle}>NAVBAR USAGE</h4>
              <span className={styles.cardBadge}>FLOATING PILL</span>
            </div>

            <div className={styles.mockupNavbarPill}>
              <div className={styles.mockupLogoWrap}>
                <BrandLogo
                  concept={selectedConcept}
                  lockup="mark"
                  size="xs"
                  variant="glass"
                  interactive={true}
                />
              </div>
              <div className={styles.mockupNavLinks}>
                <span className={`${styles.mockupLink} ${styles.mockupLinkActive}`}>Home</span>
                <span className={styles.mockupLink}>Projects</span>
                <span className={styles.mockupLink}>Skills</span>
                <span className={styles.mockupLink}>Experience</span>
                <span className={styles.mockupLink}>About</span>
                <span className={styles.mockupDotIndicator} />
              </div>
            </div>
          </div>

          {/* Favicon Variations Card */}
          <div className={styles.faviconCard}>
            <div className={styles.cardHeader}>
              <h4 className={styles.cardTitle}>FAVICON VARIATIONS</h4>
              <span className={styles.cardBadge}>ICONS</span>
            </div>

            <div className={styles.faviconGrid}>
              <div className={`${styles.faviconBox} ${styles.favDark}`} title="Dark Favicon">
                <BrandLogo concept={selectedConcept} lockup="mark" size="xs" variant="dark" interactive={false} />
                <span className={styles.favCaption}>Dark</span>
              </div>
              <div className={`${styles.faviconBox} ${styles.favLight}`} title="Light Favicon">
                <BrandLogo concept={selectedConcept} lockup="mark" size="xs" variant="light" interactive={false} />
                <span className={styles.favCaption}>Light</span>
              </div>
              <div className={`${styles.faviconBox} ${styles.favCircular}`} title="Circular Favicon">
                <BrandLogo concept={selectedConcept} lockup="mark" size="xs" variant="circular" interactive={false} />
                <span className={styles.favCaption}>Circular</span>
              </div>
              <div className={`${styles.faviconBox} ${styles.favGlass}`} title="Glass Favicon">
                <BrandLogo concept={selectedConcept} lockup="mark" size="xs" variant="glass" interactive={false} />
                <span className={styles.favCaption}>Glass</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDesignLab;
