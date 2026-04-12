/* eslint-disable @next/next/no-img-element */
'use client';
import { ProfileUserService } from '@/service/ProfileUserService';
import { ProfileService } from '@/service/ProfileService';
import { UserService } from '@/service/UserService';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

const ProfileUser = () => {
    let emptyProfileUser: Project.ProfileUser = {
        id: 0,
        profile: {
            id: 0,
            description: ''
        },
        user: {
            id: 0,
            name: '',
            login: '',
            email: '',
            password: ''
        }
    };

    const [profileUsers, setProfileUsers] = useState<Project.ProfileUser[]>([]);
    const [users, setUsers] = useState<Project.User[]>([]);
    const [profiles, setProfiles] = useState<Project.Profile[]>([]);
    const [profileUserDialog, setProfileUserDialog] = useState(false);
    const [deleteProfileUserDialog, setDeleteProfileUserDialog] = useState(false);
    const [deleteProfileUsersDialog, setDeleteProfileUsersDialog] = useState(false);
    const [profileUser, setProfileUser] = useState<Project.ProfileUser>(emptyProfileUser);
    const [selectedProfileUsers, setSelectedProfileUsers] = useState<Project.ProfileUser[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const profileUserService = new ProfileUserService();
    const userService = new UserService();
    const profileService = new ProfileService();

    useEffect(() => {
        if (profileUsers.length == 0) {
            profileUserService.listAll()
                .then((response) => {
                    console.log(response.data)
                    setProfileUsers(response.data)
                }).catch((error) => {
                    console.log(error)
                });
        }
    }, [profileUser]);

    useEffect(() => {
        userService.listAll().then((response) => setUsers(response.data)).catch(console.log);
        profileService.listAll().then((response) => setProfiles(response.data)).catch(console.log);
    }, []);

    const openNew = () => {
        setProfileUser(emptyProfileUser);
        setSubmitted(false);
        setProfileUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProfileUserDialog(false);
    };

    const hideDeleteProfileUserDialog = () => {
        setDeleteProfileUserDialog(false);
    };

    const hideDeleteProfileUsersDialog = () => {
        setDeleteProfileUsersDialog(false);
    };

    const saveProfileUser = () => {
        setSubmitted(true);

        if (!profileUser.id) {
            profileUserService.insert(profileUser)
                .then((response) => {
                    setProfileUserDialog(false);
                    setProfileUser(emptyProfileUser);
                    setProfileUsers([]);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'ProfileUser registred successfully'
                    })
                }).catch((error) => {
                    const errorMessage = error?.response?.data?.message || error?.message || "Unknown error";
                    console.log(errorMessage)
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Error while registering: ' + errorMessage
                    })
                })
        } else {
            profileUserService.update(profileUser)
                .then((response) => {
                    setProfileUserDialog(false)
                    setProfileUser(emptyProfileUser)
                    setProfileUsers([]);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'ProfileUser updated successfully'
                    })
                }).catch((error) => {
                    const errorMessage = error?.response?.data?.message || error?.message || "Unknown error";
                    console.log(errorMessage)
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Error while updating: ' + errorMessage
                    })
                })
        }
    };

    const editProfileUser = (profileUser: Project.ProfileUser) => {
        setProfileUser({ ...profileUser });
        setProfileUserDialog(true);
    };

    const confirmDeleteProfileUser = (profileUser: Project.ProfileUser) => {
        setProfileUser(profileUser);
        setDeleteProfileUserDialog(true);
    };

    const deleteProfileUser = () => {
        if (!profileUser.id) return;

        profileUserService.delete(profileUser.id)
            .then((response) => {
                setProfileUser(emptyProfileUser);
                setDeleteProfileUserDialog(false);
                setProfileUsers([]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'ProfileUser Deleted',
                    life: 3000
                });
            }).catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error while deleting profileUser',
                    life: 3000
                });
            })
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProfileUsersDialog(true);
    };

    const deleteSelectedProfileUsers = () => {
        Promise.all(selectedProfileUsers.map(async (_profileUser) => {
            if (_profileUser.id) {
                return await profileUserService.delete(_profileUser.id);
            }
        })).then((response) => {
            setProfileUsers([]);
            setSelectedProfileUsers([]);
            setDeleteProfileUsersDialog(false);
            setProfileUser(emptyProfileUser);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'ProfileUsers Deleted',
                life: 3000
            });
        }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error while deleting profileUsers',
                life: 3000
            })
        });
    };

    const onSelectChange = (e: any, name: string) => {
        const val = e.value;
        let _profileUser = { ...profileUser };
        (_profileUser as any)[name] = val;

        setProfileUser(_profileUser);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProfileUsers || !(selectedProfileUsers as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Project.ProfileUser) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const userBodyTemplate = (rowData: Project.ProfileUser) => {
        return (
            <>
                <span className="p-column-title">User</span>
                {rowData.user?.name}
            </>
        );
    };

    const descriptionBodyTemplate = (rowData: Project.ProfileUser) => {
        return (
            <>
                <span className="p-column-title">Profile</span>
                {rowData.profile?.description}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Project.ProfileUser) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProfileUser(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProfileUser(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage ProfileUsers</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const profileUserDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProfileUser} />
        </>
    );
    const deleteProfileUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProfileUserDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProfileUser} />
        </>
    );
    const deleteProfileUsersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProfileUsersDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProfileUsers} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={profileUsers}
                        selection={selectedProfileUsers}
                        onSelectionChange={(e) => setSelectedProfileUsers(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} profileUsers"
                        globalFilter={globalFilter}
                        emptyMessage="No profileUsers found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Code" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="user.name" header="User" sortable body={userBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="profile.description" header="Profile" sortable body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={profileUserDialog} style={{ width: '450px' }} header="ProfileUser Details" modal className="p-fluid" footer={profileUserDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="user">User</label>
                            <Dropdown
                                id="user"
                                value={profileUser.user}
                                onChange={(e) => onSelectChange(e, 'user')}
                                options={users}
                                optionLabel="name"
                                placeholder="Select a User"
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && (!profileUser.user || !profileUser.user.id)
                                })}
                            />
                            {submitted && (!profileUser.user || !profileUser.user.id) && <small className="p-invalid">User is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="profile">Profile</label>
                            <Dropdown
                                id="profile"
                                value={profileUser.profile}
                                onChange={(e) => onSelectChange(e, 'profile')}
                                options={profiles}
                                optionLabel="description"
                                placeholder="Select a Profile"
                                required
                                className={classNames({
                                    'p-invalid': submitted && (!profileUser.profile || !profileUser.profile.id)
                                })}
                            />
                            {submitted && (!profileUser.profile || !profileUser.profile.id) && <small className="p-invalid">Profile is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProfileUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfileUserDialogFooter} onHide={hideDeleteProfileUserDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {profileUser && (
                                <span>
                                    Are you sure you want to delete the profileUser <b>{profileUser.user?.name} - {profileUser.profile?.description}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProfileUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfileUsersDialogFooter} onHide={hideDeleteProfileUsersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {profileUser && <span>Are you sure you want to delete the selected profileUsers?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ProfileUser;
