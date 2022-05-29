type Angle = "degree" | "radian";

/**
 * Converts angle values from one unit to another.
 * Supported units: degrees, radians
 *
 * @example
 * ```
 * convertAngle(180, "degree", "radian") // 3.141592653589793
 * convertAngle(MAth.PI, "radian", "degree") // 180
 * ```
 */
const convertAngle = (value: number, from: Angle, to: Angle): number => {
  if (from === to) {
    return value;
  }

  const degree = toDegree(value, from);

  switch (to) {
    case "degree":
      return degree;

    case "radian":
      return degree * Math.PI / 180;

    default:
      throw TypeError(`convertAngle: unknown unit ${to}`);
  }
};

const toDegree = (value: number, unit: Angle): number => {
  switch (unit) {
    case "degree":
      return value;

    case "radian":
      return value * 180 / Math.PI;

    default:
      throw TypeError(`convertAngle: unknown unit ${unit}`);
  }
};

export default convertAngle;
