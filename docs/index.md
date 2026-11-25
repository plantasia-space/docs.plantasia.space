---
id: index
title: xPlorer Guide
description: Explore Plantasia Space documentation — Audios, Entangled Worlds, Orbiters, and Collections — through quick visual cards.
slug: /index
sidebar_position: 0
sidebar_custom_props:
  icon: XplorerIcon
---

import { NavigationGrid, NavigationCard } from '@site/src/components/NavigationGrid';
import PlantasiaSymbol from '@site/static/img/sidebar-icons/plantasia-logo.svg';

Explore the main sections through quick visual cards using our own symbols.

<NavigationGrid>
  <NavigationCard
    icon={
      <PlantasiaSymbol role="img" aria-label="Plantasia Space" width="32" height="32" />
    }
    title="Plantasia Space"
    description=""
    to="/docs/plantasia-space/"
  />
  <NavigationCard
    icon={
      <img
        src="https://herbarium.plantasia.space/assets/symbols/current/track.svg"
        alt="Audios"
        width="32"
        height="32"
        className="invert-on-dark"
      />
    }
    title="Audios"
    description=""
    to="/docs/audios"
  />
  <NavigationCard
    icon={
      <img
        src="https://herbarium.plantasia.space/assets/symbols/current/entangled-world.svg"
        alt="Entangled Worlds"
        width="32"
        height="32"
        className="invert-on-dark"
      />
    }
    title="Entangled Worlds"
    description=""
    to="/docs/entangled-worlds"
  />
  <NavigationCard
    icon={
      <img
        src="https://herbarium.plantasia.space/assets/symbols/current/orbiter.svg"
        alt="Orbiters"
        width="32"
        height="32"
        className="invert-on-dark"
      />
    }
    title="Orbiters"
    description=""
    to="/docs/orbiters"
  />
  <NavigationCard
    icon={
      <img
        src="https://herbarium.plantasia.space/assets/symbols/current/collection.svg"
        alt="Collections"
        width="32"
        height="32"
        className="invert-on-dark"
      />
    }
    title="Collections"
    description=""
    to="/docs/collections"
  />
</NavigationGrid>
