---
name: project-lessons-plan
description: Full lesson plan for fretify — 5 modules, progressive from beginner to advanced, with implementation priority
metadata:
  type: project
---

Agreed lesson plan for fretify (2026-05-21). Implement in priority order.

## Модуль 1 — Гриф (новый)
1. Открытые струны — назови струну по звуку
2. Натуральные ноты — какая нота на ладу (CDEFGAB)
3. Все ноты — включая диезы/бемоли

## Модуль 2 — Аккорды (частично готов)
1. Минорные аккорды ✓
2. Мажорные аккорды ✓
3. Мажор и минор ✓
4. Септаккорды — Am7 · Em7 · G7 · D7 · Cmaj7 (добавить данные)
5. Аккорд по диаграмме — видишь аппликатуру, называешь аккорд (новый тип упражнения)

## Модуль 3 — Интервалы (новый)
1. Прима, октава, квинта
2. Терции — большая vs малая
3. Все интервалы

## Модуль 4 — Гаммы (готов)
1. Мажор и минор ✓
2. Пентатоники ✓
3. Лады ✓

## Модуль 5 — Ритм (новый, требует новую механику — тэп по экрану)
1. Доли — отбей 4/4 с метрономом
2. Размеры — определи 3/4 или 4/4
3. Синкопы

## Приоритет реализации
1. Септаккорды — ~30 мин (только данные в lessonData.ts)
2. Ноты на грифе — ~2 ч (новый тип упражнения `note-on-fret`)
3. Интервалы на слух — ~3 ч (аудио генерация двух нот)
4. Аккорд по диаграмме — ~2 ч (новый тип `chord-diagram`)
5. Ритм — ~1 день (новая tap-механика)

**Why:** Agreed with user as the roadmap for the lessons module.
**How to apply:** When user asks about lessons, reference this plan. Suggest next item by priority.
