import { Router } from "express";
import { createShape } from "./shapes/create-shape.js";
import { countShapes } from "./shapes/count-shapes.js";
import { getShapes } from "./shapes/get-shapes.js";
import { getShape } from "./shapes/get-shape.js";
import { deleteShape } from "./shapes/delete-shape.js";
import { createBlueprint } from "./blueprints/create-blueprint.js";
import { getBlueprints } from "./blueprints/get-blueprints.js";
import { getBlueprint } from "./blueprints/get-blueprint.js";
import { deleteBlueprint } from "./blueprints/delete-blueprint.js";
import { countBlueprints } from "./blueprints/count-blueprints.js";
import { createOptimalBlueprint } from "./optimal-blueprints/create-optimal-blueprint.js";
import { getOptimalBlueprint } from "./optimal-blueprints/get-optimal-blueprint.js";
import { getOptimalBlueprints } from "./optimal-blueprints/get-optimal-blueprints.js";
import { deleteOptimalBlueprint } from "./optimal-blueprints/delete-optimal-blueprint.js";

const router = Router();

// Shapes
router.post("/shapes", createShape);
router.get("/shapes", getShapes);
router.get("/shapes/count", countShapes);
router.get("/shapes/:id", getShape);
router.delete("/shapes/:id", deleteShape);

// Blueprints
router.post("/blueprints", createBlueprint);
router.get("/blueprints", getBlueprints);
router.get("/blueprints/count", countBlueprints);
router.get("/blueprints/:id", getBlueprint);
router.delete("/blueprints/:id", deleteBlueprint);

// Optimal blueprints
router.post("/optimal-blueprints", createOptimalBlueprint);
router.get("/optimal-blueprints", getOptimalBlueprints);
router.get("/optimal-blueprints/:id", getOptimalBlueprint);
router.delete("/optimal-blueprints/:id", deleteOptimalBlueprint);

export { router };
