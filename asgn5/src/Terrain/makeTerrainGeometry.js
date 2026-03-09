import * as THREE from "three";

export default function makeTerrainGeometry(size, scale, offX, offZ, elevationGenerator) {
    // Note: it finds the elevations outside of the actual region so it can calculate the normals

    const elevations = [];
    const colors = [];
    for (let x = 0; x < size + 3; x++) {
        elevations.push([]);
        colors.push([]);
        for (let z = 0; z < size + 3; z++) {
            elevations[x].push(elevationGenerator.at((x - 1) * scale + offX, (z - 1) * scale + offZ));
            colors[x].push(elevationGenerator.colorAt(elevationGenerator.at((x - 0.5) * scale + offX, (z - 0.5) * scale + offZ)));
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

                let vec = [-(yL - yR) / scale, -2, -(yD - yU) / scale];
                vec = vec.map(v => v / Math.sqrt(vec[0] ** 2 + vec[1] ** 2 + vec[2] ** 2)); // Normalize
                normalsPre[x].push(vec);
            }
        }
    }

    const vertices = [];
    const normals = [];
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
                (x_ + 1) * scale, yBR, (z_) * scale,
                (x_) * scale, yTL, (z_ + 1) * scale,
                (x_ + 1) * scale, yTR, (z_ + 1) * scale,
                (x_) * scale, yTL, (z_ + 1) * scale,
                (x_ + 1) * scale, yBR, (z_) * scale
            ]);

            normals.push(...[
                ...normalsPre[x][z],
                ...normalsPre[x + 1][z],
                ...normalsPre[x][z + 1],
                ...normalsPre[x + 1][z + 1],
                ...normalsPre[x][z + 1],
                ...normalsPre[x + 1][z]
            ]);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3));

    return geometry;
}
