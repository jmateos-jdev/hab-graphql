import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const usuarios = [
  {
    id: 1,
    name: "user 1",
    lastName: "apellido 1"
  },
  {
    id: 2,
    name: "user 2",
    lastName: "apellido 2"
  },
  {
    id: 3,
    name: "user 3"
  }
];

const typeDefs = gql`
  type Site {
    id: ID!
    name: String!
    active: Boolean!
  }

  type ProductInfo {
    id: ID!
    name: String!
    brand: String
    color: String
    href: String
    deleted: Boolean!
    sites: Site!
    products: [Product]
    createdBy: ID!
    createdAt: String!
    updatedBy: ID
    updatedAt: String
  }

  type Product {
    id: ID!
    available: Boolean!
    currency: String
    price: Float
    listPrice: Float
    discount: String
    promo: String
    unitPrice: Float
    unit: String
    href: String
    productInfo: ProductInfo!
    createdBy: ID!
    createdAt: String!
    updatedBy: ID
    updatedAt: String
  }

  type Usuario {
    id: Int!
    name: String!
    lastName: String
  }

  type Character {
    id: ID!
    name: String!
    status: String!
    species: String!
    type: String
    gender: String!
    origin: Origin!
    location: Location!
    image: String!
    episode: [String!]!
    url: String!
    created: String!
  }

  type Origin {
    name: String!
    url: String
  }

  type Location {
    name: String!
    url: String!
  }

  type Query {
    getProductsById(id: Int!, date: String!): [ProductInfo]
    productos(ids: [Int!]): [ProductInfo]
    producto(id: Int!): ProductInfo
    usuarios: [Usuario]!
    usuario(id: Int!): Usuario
    character(id: ID!): Character
  }

  type Mutation {
    agregarUsuario(name: String!, lastName: String): Usuario
    borrarUsuario(id: Int!): [Usuario]
    editarUsuario(id: Int!, name: String, lastName: String): Usuario
  }
`;

const resolvers = {
  Query: {
    getProductsById: async (_, args) => {
      const fechaFiltro = new Date(args.date); // "2024-08-29"

      const productos = await prisma.product_info.findMany({
        select: {
          id: true,
          name: true,
          brand: true,
          color: true,
          href: true,
          deleted: true,
          sites: {
            select: {
              id: true,
              name: true,
              active: true
            }
          },
          createdBy: true,
          createdAt: true,
          updatedBy: true,
          updatedAt: true,
          products: {
            select: {
              id: true,
              available: true,
              currency: true,
              price: true,
              listPrice: true,
              discount: true,
              promo: true,
              unitPrice: true,
              unit: true,
              href: true,
              createdBy: true,
              createdAt: true,
              updatedBy: true,
              updatedAt: true
            },
            where: {
              createdAt: {
                gte: new Date(fechaFiltro.setHours(0, 0, 0, 0)),
                lt: new Date(fechaFiltro.setHours(23, 59, 59, 999))
              }
            }
          }
        },
        where: {
          id_product: args.id
        }
      });
      return productos;
    },
    producto: async (_, args) => {
      const producto = await prisma.product_info.findUnique({
        select: {
          id: true,
          name: true,
          brand: true,
          color: true,
          href: true,
          deleted: true,
          sites: {
            select: {
              id: true,
              name: true,
              active: true
            }
          },
          createdBy: true,
          createdAt: true,
          updatedBy: true,
          updatedAt: true,
          products: {
            select: {
              id: true,
              available: true,
              currency: true,
              price: true,
              listPrice: true,
              discount: true,
              promo: true,
              unitPrice: true,
              unit: true,
              href: true,
              createdBy: true,
              createdAt: true,
              updatedBy: true,
              updatedAt: true
            }
          }
        },
        where: { id: args.id }
      });
      return producto;
    },
    productos: async (_, args) => {
      const producto = await prisma.product_info.findMany({
        select: {
          id: true,
          name: true,
          brand: true,
          color: true,
          href: true,
          deleted: true,
          sites: {
            select: {
              id: true,
              name: true,
              active: true
            }
          },
          createdBy: true,
          createdAt: true,
          updatedBy: true,
          updatedAt: true,
          products: {
            select: {
              id: true,
              available: true,
              currency: true,
              price: true,
              listPrice: true,
              discount: true,
              promo: true,
              unitPrice: true,
              unit: true,
              href: true,
              createdBy: true,
              createdAt: true,
              updatedBy: true,
              updatedAt: true
            }
          }
        },
        where: {
          id: { in: args.ids }
        }
      });
      return producto;
    },
    character: async (_, { id }) => {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      let character = {};

      await fetch(
        `https://rickandmortyapi.com/api/character/${id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          character = result;
        })
        .catch((error) => console.error(error));

      return character;
    },
    usuarios: () => usuarios,
    usuario: (_, args) => usuarios.find((u) => u.id == args.id)
  },
  Mutation: {
    agregarUsuario: (_, args) => {
      const nuevoUsuario = {
        ...args,
        id: usuarios.length + 1
      };

      usuarios.push(nuevoUsuario);

      return nuevoUsuario;
    },
    borrarUsuario: (_, { id }) => {
      const objetoBorrar = usuarios.findIndex((u) => u.id == id);
      if (objetoBorrar !== -1) {
        usuarios.splice(objetoBorrar, 1);
      } else {
        return null;
      }
      return usuarios;
    },
    editarUsuario: (_, args) => {
      const usuarioEditar = usuarios.findIndex((u) => u.id == args.id);
      if (usuarioEditar !== -1) {
        if (args.name) {
          usuarios[usuarioEditar].name = args.name;
        }
        if (args.lastName) {
          usuarios[usuarioEditar].lastName = args.lastName;
        }

        return usuarios[usuarioEditar];
      } else {
        return null;
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: "",
    credentials: true
  }
});

server.listen().then(({ url }) => {
  console.log(`Servidor corriendo en ${url}`);
});
