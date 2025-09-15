import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        // Make password NOT required for Google sign-in
        return !this.authProvider || this.authProvider === "email"
      },
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isWelcomed: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    authProvider: {
      //  'email' o 'google'
      type: String,
      enum: ["email"],
      default: "email",
    },
    // Nuevos campos para el seguimiento de descargas del catálogo
    catalogoDescargado: {
      type: Boolean,
      default: false,
    },
    fechaDescarga: {
      type: Date,
      default: null,
    },
    region: {
      type: String,
    },
    storeName: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

// Middleware para hashear la contraseña antes de guardar (solo para registro normal)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
    return
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model("User", userSchema)

export default User
