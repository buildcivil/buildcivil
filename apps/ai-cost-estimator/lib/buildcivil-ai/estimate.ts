import type { ConstructionSelections, CostBreakdown, GeneratedPlan, ProjectType } from './types'

/** Mid-point sq ft for the selected area band (treated as typical floor plate / footprint). */
export function resolveAreaMidpoint(area: string): number {
  if (area.includes('5,000+')) return 6000
  if (area.includes('3,000 – 5,000')) return 4000
  if (area.includes('2,000 – 3,000')) return 2500
  if (area.includes('1,000 – 2,000')) return 1500
  if (area.includes('Under 1,000')) return 800
  // Fallbacks for slightly altered labels
  if (area.includes('3,000')) return 4000
  if (area.includes('2,000')) return 2500
  if (area.includes('1,000')) return 1500
  return 800
}

/** How many floors / levels the selection implies. */
export function resolveFloorCount(floors: string): number {
  if (floors.includes('G + 3') || floors.includes('G+3')) return 4
  if (floors.includes('G + 2') || floors.includes('G+2')) return 3
  if (floors.includes('G + 1') || floors.includes('G+1')) return 2
  return 1
}

/** Location cost index relative to Noida baseline (1.0). */
export function resolveCityMultiplier(location: string): number {
  const table: Record<string, number> = {
    'Delhi NCR': 1.08,
    'Noida & Greater Noida': 1.0,
    Lucknow: 0.85,
    Dehradun: 0.9,
    'Ghaziabad / Meerut': 0.93,
  }
  return table[location] ?? 1.0
}

function resolveBudgetRate(budget: string): number {
  if (budget === 'Luxury') return 3200
  if (budget === 'Premium') return 2600
  if (budget === 'Standard') return 1900
  return 1400
}

function resolveMaterialMultiplier(materials: string): number {
  if (materials.includes('Premium')) return 1.12
  if (materials.includes('Eco')) return 1.08
  return 1.0
}

function resolveProjectTypeMultiplier(projectType: string): number {
  if (projectType === 'villa') return 1.15
  if (projectType === 'commercial') return 1.1
  if (projectType === 'renovation') return 0.55
  if (projectType === 'interior') return 0.42
  return 1.0
}

type CostShares = {
  structure: number
  finishing: number
  electrical: number
  plumbing: number
  miscellaneous: number
}

function resolveCostShares(projectType: string): CostShares {
  if (projectType === 'interior') {
    // Interior-only scope: no civil structure / MEP packages — finish package + contingency.
    return {
      structure: 0,
      finishing: 0.9,
      electrical: 0,
      plumbing: 0,
      miscellaneous: 0.1,
    }
  }

  if (projectType === 'renovation') {
    return {
      structure: 0.2,
      finishing: 0.45,
      electrical: 0.12,
      plumbing: 0.1,
      miscellaneous: 0.13,
    }
  }

  // Full new-build: residential, villa, commercial
  return {
    structure: 0.42,
    finishing: 0.28,
    electrical: 0.1,
    plumbing: 0.08,
    miscellaneous: 0.12,
  }
}

export type CostEstimateResult = {
  areaPerFloor: number
  floorCount: number
  totalBuiltUpSqFt: number
  ratePerSqFt: number
  cityMultiplier: number
  cost: CostBreakdown
}

/**
 * Deterministic India-market estimate from user selections.
 * Area band = typical floor plate; total built-up = plate × floors.
 * City, budget, materials, and project type all affect the rate and split.
 */
export function estimateConstructionCost(
  selections: Pick<
    ConstructionSelections,
    'projectType' | 'location' | 'area' | 'floors' | 'budget' | 'materials'
  > & { projectTypeLabel?: string },
): CostEstimateResult {
  const areaPerFloor = resolveAreaMidpoint(selections.area || '')
  const floorCount = resolveFloorCount(selections.floors || '')
  const totalBuiltUpSqFt = areaPerFloor * floorCount

  const cityMultiplier = resolveCityMultiplier(selections.location || '')
  const budgetRate = resolveBudgetRate(selections.budget || '')
  const materialMultiplier = resolveMaterialMultiplier(selections.materials || '')
  const typeMultiplier = resolveProjectTypeMultiplier(selections.projectType || '')

  const ratePerSqFt = Math.round(budgetRate * cityMultiplier * materialMultiplier * typeMultiplier)
  const totalBase = totalBuiltUpSqFt * ratePerSqFt
  const shares = resolveCostShares(selections.projectType || '')

  const structure = Math.round(totalBase * shares.structure)
  const finishing = Math.round(totalBase * shares.finishing)
  const electrical = Math.round(totalBase * shares.electrical)
  const plumbing = Math.round(totalBase * shares.plumbing)
  const miscellaneous = Math.round(totalBase * shares.miscellaneous)
  const total = structure + finishing + electrical + plumbing + miscellaneous

  return {
    areaPerFloor,
    floorCount,
    totalBuiltUpSqFt,
    ratePerSqFt,
    cityMultiplier,
    cost: { structure, finishing, electrical, plumbing, miscellaneous, total },
  }
}

export function buildFallbackPhases(projectType: string): GeneratedPlan['phases'] {
  if (projectType === 'interior') {
    return [
      {
        name: 'Design & mood boards',
        duration: '2–4 weeks',
        description: 'Space planning, material boards, 3D views, and client sign-off on finishes.',
      },
      {
        name: 'Site prep & demolition',
        duration: '1–2 weeks',
        description: 'Protective works, selective dismantling, and surface preparation.',
      },
      {
        name: 'Carpentry, MEP & surfaces',
        duration: '6–10 weeks',
        description: 'Modular units, electrical points, plumbing fixtures, flooring, and wall finishes.',
      },
      {
        name: 'Styling & handover',
        duration: '2–3 weeks',
        description: 'Fixtures, soft furnishings touch-ups, snag list, and final walkthrough.',
      },
    ]
  }

  if (projectType === 'renovation') {
    return [
      {
        name: 'Survey & redesign',
        duration: '3–5 weeks',
        description: 'As-built survey, structural checks, revised layouts, and approvals where needed.',
      },
      {
        name: 'Selective civil & structure',
        duration: '4–8 weeks',
        description: 'Demolition, strengthening, openings, and limited RCC / masonry changes.',
      },
      {
        name: 'MEP upgrades',
        duration: '3–5 weeks',
        description: 'Rewiring, plumbing replacement, waterproofing, and service coordination.',
      },
      {
        name: 'Finishing & handover',
        duration: '6–10 weeks',
        description: 'Flooring, paint, kitchens, bathrooms, fixtures, and final snag closure.',
      },
    ]
  }

  return [
    {
      name: 'Design & approvals',
      duration: '4–8 weeks',
      description: 'Architectural drawings, structural design, and local approvals.',
    },
    {
      name: 'Foundation & structure',
      duration: '3–5 months',
      description: 'Excavation, RCC frame, block work, and slab cycles per floor.',
    },
    {
      name: 'MEP & roofing',
      duration: '2–3 months',
      description: 'Electrical conduits, plumbing, waterproofing, and roof completion.',
    },
    {
      name: 'Finishing & handover',
      duration: '3–4 months',
      description: 'Flooring, paint, kitchens, bathrooms, fixtures, and snag list.',
    },
  ]
}

export function buildFallbackRecommendations(projectType: string): string[] {
  if (projectType === 'interior') {
    return [
      'Finalize material boards and mock-ups before bulk procurement to avoid rework.',
      'Keep 8–10% contingency for custom joinery and fixture changes.',
      'Coordinate electrical points and plumbing locations before false-ceiling and tiling.',
    ]
  }

  if (projectType === 'renovation') {
    return [
      'Get a structural opinion before removing walls or adding loads.',
      'Sequence wet works (bathrooms, waterproofing) ahead of final flooring.',
      'Keep 10–15% contingency for hidden defects discovered after opening up.',
    ]
  }

  return [
    'Book a site visit before finalizing structural and finish specifications.',
    'Keep 8–12% contingency for material price changes and design revisions.',
    'Align electrical and plumbing layouts before plaster work begins.',
  ]
}

export function buildIndicativePlan(
  selections: Record<string, string>,
): GeneratedPlan {
  const estimate = estimateConstructionCost({
    projectType: (selections.projectType || 'residential') as ProjectType,
    projectTypeLabel: selections.projectTypeLabel,
    location: selections.location || '',
    area: selections.area || '',
    floors: selections.floors || '',
    budget: selections.budget || '',
    materials: selections.materials || '',
  })

  const projectType = selections.projectType || 'residential'
  const label = selections.projectTypeLabel ?? 'project'
  const location = selections.location ?? 'your city'
  const builtUp = estimate.totalBuiltUpSqFt.toLocaleString('en-IN')
  const perFloor = estimate.areaPerFloor.toLocaleString('en-IN')

  const scopeLine =
    projectType === 'interior'
      ? `interior fit-out across roughly ${builtUp} sq ft`
      : projectType === 'renovation'
        ? `renovation covering roughly ${builtUp} sq ft`
        : `construction of roughly ${builtUp} sq ft across ${selections.floors || `${estimate.floorCount} level(s)`}`

  return {
    summary: `Based on your ${label} in ${location}, this indicative plan covers ${scopeLine} at about ₹${estimate.ratePerSqFt.toLocaleString('en-IN')}/sq ft (${selections.budget || 'selected'} tier, ${selections.materials || 'standard finishes'}). Floor plate used: ~${perFloor} sq ft × ${estimate.floorCount} level(s).`,
    builtUpArea: `${builtUp} sq ft (≈ ${perFloor} sq ft × ${estimate.floorCount} floor${estimate.floorCount > 1 ? 's' : ''})`,
    carpetArea: `${Math.round(estimate.totalBuiltUpSqFt * 0.75).toLocaleString('en-IN')} sq ft (est. 75% of built-up)`,
    cost: estimate.cost,
    timeline: selections.timeline ?? '12 – 18 months',
    phases: buildFallbackPhases(projectType),
    recommendations: buildFallbackRecommendations(projectType),
    disclaimer:
      'This is an AI-assisted indicative estimate for planning purposes only. Final cost and timeline require a site survey and detailed BOQ from BuildCivil.',
  }
}
