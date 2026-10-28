import React, { useEffect, useState } from 'react';
import { userService } from './userService';
import { useAuth } from '../auth/AuthContext';
import UserList from './UserList';
import UserRoleModal from './UserRoleModal';
import { Header } from '../../components/layout';
import { Select, RoleIdentityBanner } from '../../components/common';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';

  // Role filter defaults:
  // Admin -> by default shows all or admin
  // Manager -> shows 'manager' ("keval manager ki")
  // Viewer -> shows 'viewer'
  const [roleFilter, setRoleFilter] = useState(
    isAdmin ? '' : isManager ? 'manager' : 'viewer'
  );
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers({
        role: roleFilter || undefined,
      });
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const handleEditRole = (targetUser) => {
    setSelectedUser(targetUser);
    setIsModalOpen(true);
  };

  const handleSaveRole = async (userId, newRole) => {
    await userService.updateUserRole(userId, newRole);
    loadUsers();
  };

  // Role options strictly isolated:
  // Admin can select all
  // Manager can ONLY select managers or viewers (NEVER admin)
  // Viewer cannot change filters
  const roleOptions = isAdmin
    ? [
        { value: '', label: 'All Registered Roles' },
        { value: 'admin', label: 'Administrators Only' },
        { value: 'manager', label: 'Facility Managers' },
        { value: 'viewer', label: 'Viewers' },
      ]
    : isManager
    ? [
        { value: 'manager', label: 'Facility Managers Only' },
        { value: 'viewer', label: 'Viewers & Operators' },
      ]
    : [{ value: 'viewer', label: 'My Viewer Profile' }];

  const pageTitle = isAdmin
    ? 'User Accounts & Platform Administration'
    : isManager
    ? 'Facility Management Directory'
    : 'Viewer Profile & Details';

  const pageSubtitle = isAdmin
    ? 'Manage enterprise administrators, facility operations managers, and operator privileges.'
    : isManager
    ? 'Review facility manager colleagues and assigned viewer staff. Administrative accounts are strictly hidden.'
    : 'Personal account profile and telemetry viewer access scope.';

  return (
    <div>
      <Header
        title={pageTitle}
        subtitle={pageSubtitle}
      />

      <RoleIdentityBanner />

      {/* Role filter dropdown - hidden if viewer */}
      {!currentUser || currentUser.role !== 'viewer' ? (
        <div className="w-full sm:w-64 mb-6">
          <Select
            label="Filter Accounts By Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={roleOptions}
            placeholder={isManager ? undefined : 'Select Role Filter'}
          />
        </div>
      ) : null}

      <UserList
        users={users}
        loading={loading}
        onEditRole={handleEditRole}
        currentUser={currentUser}
      />

      <UserRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveRole}
      />
    </div>
  );
}
