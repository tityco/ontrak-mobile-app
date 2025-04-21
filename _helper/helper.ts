import { TextureLoader, THREE } from "expo-three";
import * as FileSystem from 'expo-file-system';



export async function loadTextureFromURL(imageUrl: any): Promise<THREE.Texture> {
  try {
    const fileUri = `${FileSystem.cacheDirectory}${imageUrl.replace(/\\/g, "").replace(/\//g, "")}temp_texture.jpg`;
    await FileSystem.downloadAsync(imageUrl, fileUri);
    const texture = new TextureLoader().load(fileUri);
    return texture;
  } catch (error) {
    console.error("Lỗi tải ảnh:", error);
    return null;
  }
};
export function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getClosestPointOnSegment(p: any, a: any, b: any) {
  const apx = p.x - a.x;
  const apy = p.y - a.y;
  const abx = b.x - a.x;
  const aby = b.y - a.y;

  const ab2 = abx * abx + aby * aby;
  const ap_ab = apx * abx + apy * aby;

  let t = ap_ab / ab2;
  t = Math.max(0, Math.min(1, t)); // Clamp t từ 0 đến 1

  return {
    x: a.x + abx * t,
    y: a.y + aby * t
  };
}

export function findNearestPointOnEdges(
  point: { x: number; y: number },
  edges: any[]
): { x: number; y: number } {
  let minDist = Infinity;
  let closest = null;

  for (let edge of edges) {
    const a = { x: edge.x1, y: edge.y1 };
    const b = { x: edge.x2, y: edge.y2 };
    const candidate = getClosestPointOnSegment(point, a, b);
    const d = distance(candidate, point);

    if (d < minDist) {
      minDist = d;
      closest = candidate;
    }
  }

  return closest!;
}
