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
];

export { exampleInputs };
