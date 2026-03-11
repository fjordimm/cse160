import * as THREE from "three";

export default function makeTerrainGeometry(size, scale, offX, offZ, uvScale, elevationGenerator) {
    // Note: it finds the elevations outside of the actual region so it can calculate the normals

    const elevations = [];
    const colorsPre = [];
    for (let x = 0; x < size + 3; x++) {
        elevations.push([]);
        colorsPre.push([]);
        for (let z = 0; z < size + 3; z++) {
            const xR = (x - 1) * scale + offX;
            const zR = (z - 1) * scale + offZ;
            const elev = elevationGenerator.at(xR, zR);
            elevations[x].push(elev);
            colorsPre[x].push(elevationGenerator.colorAt(xR, zR, elev));
        }
    }

    const normalsPre = [];
    for (let x = 0; x < elevations.length - 1; x++) {
        normalsPre.push([]);
        for (let z = 0; z < elevations[0].length - 1; z++) {
            if (x <= 0 || x >= elevations.length - 1 || z <= 0 || z >= elevations[0].length - 1) {
                normalsPre[x].push([0, 0, 0]);
            } else {
                const yU = elevations[x][z + 1];
                const yD = elevations[x][z - 1];
                const yR = elevations[x + 1][z];
                const yL = elevations[x - 1][z];

                let vec = [(yL - yR) / scale, 2, (yD - yU) / scale];
                vec = vec.map(v => v / Math.sqrt(vec[0] ** 2 + vec[1] ** 2 + vec[2] ** 2)); // Normalize
                normalsPre[x].push(vec);
            }
        }
    }

    const vertices = [];
    const uv = [];
    const normals = [];
    const colors = [];
    for (let x = 1; x < elevations.length - 2; x++) {
        for (let z = 1; z < elevations[0].length - 2; z++) {
            const yBL = elevations[x][z];
            const yBR = elevations[x + 1][z];
            const yTL = elevations[x][z + 1];
            const yTR = elevations[x + 1][z + 1];

            const x_ = x - 1;
            const z_ = z - 1;

            vertices.push(...[
                (x_) * scale, yBL, (z_) * scale,
                (x_) * scale, yTL, (z_ + 1) * scale,
                (x_ + 1) * scale, yBR, (z_) * scale,
                (x_ + 1) * scale, yTR, (z_ + 1) * scale,
                (x_ + 1) * scale, yBR, (z_) * scale,
                (x_) * scale, yTL, (z_ + 1) * scale
            ]);

            uv.push(...[
                uvScale * (offX + (x_) * scale), uvScale * (offZ + (z_) * scale),
                uvScale * (offX + (x_) * scale), uvScale * (offZ + (z_ + 1) * scale),
                uvScale * (offX + (x_ + 1) * scale), uvScale * (offZ + (z_) * scale),
                uvScale * (offX + (x_ + 1) * scale), uvScale * (offZ + (z_ + 1) * scale),
                uvScale * (offX + (x_ + 1) * scale), uvScale * (offZ + (z_) * scale),
                uvScale * (offX + (x_) * scale), uvScale * (offZ + (z_ + 1) * scale),
            ]);

            normals.push(...[
                ...normalsPre[x][z],
                ...normalsPre[x][z + 1],
                ...normalsPre[x + 1][z],
                ...normalsPre[x + 1][z + 1],
                ...normalsPre[x + 1][z],
                ...normalsPre[x][z + 1]
            ]);

            const colBL = colorsPre[x][z];
            const colBR = colorsPre[x + 1][z];
            const colTL = colorsPre[x][z + 1];
            const colTR = colorsPre[x + 1][z + 1];

            colors.push(...[
                ...colBL,
                ...colTL,
                ...colBR,
                ...colTR,
                ...colBR,
                ...colTL
            ]);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uv), 2));
    geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));

    return geometry;
}
