import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group } from '@/types';
import { generateId } from '@/utils/formatters';
import { currentUser } from '@/constants/mockData';

interface GroupState {
  groups: Group[];
  addGroup: (name: string, description: string, members: string[], image: string) => Group;
  getGroup: (id: string) => Group | undefined;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  addMemberToGroup: (groupId: string, userId: string) => void;
  removeMemberFromGroup: (groupId: string, userId: string) => void;
}

// Initial groups for demo purposes
const initialGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Roommates',
    description: 'Expenses for our apartment',
    createdAt: new Date().toISOString(),
    members: ['user-1', 'user-2', 'user-3'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'group-2',
    name: 'Trip to Goa',
    description: 'Beach vacation expenses',
    createdAt: new Date().toISOString(),
    members: ['user-1', 'user-4', 'user-5'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
  },
];

export const useGroupStore = create<GroupState>()(
  persist(
    (set, get) => ({
      groups: initialGroups,
      
      addGroup: (name, description, members, image) => {
        const newGroup: Group = {
          id: `group-${generateId()}`,
          name,
          description,
          createdAt: new Date().toISOString(),
          members: [currentUser.id, ...members],
          image,
        };
        
        set(state => ({
          groups: [...state.groups, newGroup],
        }));
        
        return newGroup;
      },
      
      getGroup: (id) => {
        return get().groups.find(group => group.id === id);
      },
      
      updateGroup: (id, updates) => {
        set(state => ({
          groups: state.groups.map(group => 
            group.id === id ? { ...group, ...updates } : group
          ),
        }));
      },
      
      deleteGroup: (id) => {
        set(state => ({
          groups: state.groups.filter(group => group.id !== id),
        }));
      },
      
      addMemberToGroup: (groupId, userId) => {
        set(state => ({
          groups: state.groups.map(group => {
            if (group.id === groupId && !group.members.includes(userId)) {
              return {
                ...group,
                members: [...group.members, userId],
              };
            }
            return group;
          }),
        }));
      },
      
      removeMemberFromGroup: (groupId, userId) => {
        set(state => ({
          groups: state.groups.map(group => {
            if (group.id === groupId) {
              return {
                ...group,
                members: group.members.filter(id => id !== userId),
              };
            }
            return group;
          }),
        }));
      },
    }),
    {
      name: 'group-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);