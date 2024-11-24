const exampleInputs = [
  {
    target_shapes: [
      {
        id: 1,
        name: "Triangle",
        count: 3,
      },
      {
        id: 2,
        name: "Square",
        count: 2,
      },
      {
        id: 1,
        name: "Triangle",
        count: 2,
      },
    ],
    source_blueprints: [
      {
        id: 1,
        name: "Blueprint A",
        shapes: [
          {
            id: 1,
            name: "Triangle",
            count: 1,
          },
          {
            id: 3,
            name: "Circle",
            count: 1,
          },
        ],
      },
      {
        id: 2,
        name: "Blueprint B",
        shapes: [
          {
            id: 2,
            name: "Square",
            count: 1,
          },
          {
            id: 1,
            name: "Triangle",
            count: 1,
          },
          {
            id: 3,
            name: "Circle",
            count: 1,
          },
        ],
      },

      {
        id: 3,
        name: "Blueprint C",
        shapes: [
          {
            id: 1,
            name: "Triangle",
            count: 1,
          },
          {
            id: 3,
            name: "Circle",
            count: 1,
          },
        ],
      },
    ],
  },
  {
    target_shapes: [
      {
        id: 1,
        name: "Square",
        count: 2,
      },
      {
        id: 4,
        name: "Diamond",
        count: 5,
      },
    ],
    source_blueprints: [
      {
        id: 1,
        name: "Blueprint A",
        shapes: [
          {
            id: 1,
            name: "Circle",
            count: 1,
          },
          {
            id: 2,
            name: "Square",
            count: 1,
          },
          {
            id: 3,
            name: "Triangle",
            count: 1,
          },
        ],
      },
      {
        id: 2,
        name: "Blueprint B",
        shapes: [
          {
            id: 1,
            name: "Circle",
            count: 2,
          },
          {
            id: 2,
            name: "Square",
            count: 2,
          },
          {
            id: 3,
            name: "Triangle",
            count: 2,
          },
        ],
      },
      {
        id: 3,
        name: "Blueprint C",
        shapes: [
          {
            id: 1,
            name: "Circle",
            count: 3,
          },
          {
            id: 2,
            name: "Square",
            count: 3,
          },
          {
            id: 3,
            name: "Triangle",
            count: 3,
          },
        ],
      },
      {
        id: 4,
        name: "Blueprint D",
        shapes: [
          {
            id: 1,
            name: "Circle",
            count: 5,
          },
        ],
      },
      {
        id: 5,
        name: "Blueprint E",
        shapes: [
          {
            id: 4,
            name: "Diamond",
            count: 1,
          },
        ],
      },
    ],
  },
];

export { exampleInputs };
