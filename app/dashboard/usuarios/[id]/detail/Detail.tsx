import { User } from "@/app/types/UsersTypes";

interface DetailProps {
  user: User;
}

const Detail: React.FC<DetailProps> = ({ user }) => {
  return (
    <div className="space-y-4">
      <p><strong>ID:</strong> {user._id}</p>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Permisos:</strong> {user.permissions.join(", ") || "Ninguno"}</p>
      <p><strong>Roles:</strong>
        <ul>
          {user.roles.map((role) => (
            <li key={role._id}>
              {role.name} (Permisos: {role.permissions.join(", ")})
            </li>
          ))}
        </ul>
      </p>
      <p><strong>Creado:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      <p><strong>Actualizado:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
    </div>
  );
};

export default Detail;