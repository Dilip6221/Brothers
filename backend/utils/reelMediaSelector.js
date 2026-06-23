const STAGE_PRIORITY = [
  "CHECK_IN",
  "INSPECTION",
  "WORK_STARTED",
  "PART_REPLACED",
  "QUALITY_CHECK",
  "READY",
  "DELIVERED",
];

const pickByStage = (media, stage, limit) => {
  return media
    .filter((m) => m.stage === stage && m.isActive !== false)
    .slice(0, limit);
};

const buildReelSequence = (media = []) => {
  const activeMedia = media
    .filter((m) => m?.url && m.isActive !== false)
    .sort((a, b) => {
      const stageA = STAGE_PRIORITY.indexOf(a.stage);
      const stageB = STAGE_PRIORITY.indexOf(b.stage);

      if (stageA !== stageB) return stageA - stageB;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  const sequence = [
    ...pickByStage(activeMedia, "CHECK_IN", 2),
    ...pickByStage(activeMedia, "INSPECTION", 2),
    ...pickByStage(activeMedia, "WORK_STARTED", 4),
    ...pickByStage(activeMedia, "PART_REPLACED", 2),
    ...pickByStage(activeMedia, "QUALITY_CHECK", 2),
    ...pickByStage(activeMedia, "READY", 3),
    ...pickByStage(activeMedia, "DELIVERED", 2),
  ];

  if (sequence.length >= 3) return sequence;

  return activeMedia.slice(0, 8);
};

module.exports = {
  buildReelSequence,
};