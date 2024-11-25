import * as xlsx from "xlsx";
import { Readable } from "node:stream";

/**
 * Prepares Shapes for the excel export.
 *
 * @param {Shape[]} shapes
 * @returns {Object[]} - { shape_id, shape_name }
 *
 */
function prepareExcelShapes(shapes) {
  const excelShapes = [];
  for (let i = 0; i < shapes.length; i++) {
    excelShapes.push({
      shape_id: shapes[i].id,
      shape_name: shapes[i].name,
    });
  }
  return excelShapes;
}
/**
 * Prepares Blueprints for the excel export.
 *
 * @param {Blueprint[]} blueprints
 * @returns {Object[]} - { blueprint_id, shape_id, blueprint_name, shape_name, shape_count };
 *
 * @example
 * // A blueprint with 2 shapes in hierarchical form ->
 * Blueprint = { name: A, id, shapes: [ { name: AA, id, }, { name: AB, id },... ] }
 * // The same blueprint with 2 shapes in flat form ->
 * { blueprint_name: A , blueprint_id, shape_name: AA, shape_id },
 * { blueprint_name: A, blueprint_id, shape_name: AB, shape_id }
 */
function prepareExcelBlueprints(blueprints) {
  const excelBlueprints = [];
  for (let i = 0; i < blueprints.length; i++) {
    for (let y = 0; y < blueprints[i].shapes.length; y++) {
      excelBlueprints.push({
        blueprint_id: blueprints[i].id,
        shape_id: blueprints[i].shapes[y].id,
        blueprint_name: blueprints[i].name,
        shape_name: blueprints[i].shapes[y].name,
        shape_count: blueprints[i].shapes[y].count,
      });
    }
  }
  return excelBlueprints;
}

function toExcel(blueprints, shapes) {
  const workbook = xlsx.utils.book_new();

  if (blueprints) {
    xlsx.utils.book_append_sheet(
      workbook,
      xlsx.utils.json_to_sheet(prepareExcelBlueprints(blueprints)),
      "blueprints",
    );
  }

  if (shapes) {
    xlsx.utils.book_append_sheet(
      workbook,
      xlsx.utils.json_to_sheet(prepareExcelShapes(shapes)),
      "shapes",
    );
  }
  xlsx.stream.set_readable(Readable);
  return xlsx.stream.to_xlml(workbook);
}

export { toExcel, prepareExcelBlueprints, prepareExcelShapes };
