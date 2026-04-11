/* eslint-disable @next/next/no-img-element */
'use client';
import { ProfileService } from '@/service/ProfileService';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

const Profile = () => {
    let emptyProfile: Project.Profile = {
        id: 0,
        description: '',
    };

    const [profiles, setProfiles] = useState<Project.Profile[]>([]);
    const [profileDialog, setProfileDialog] = useState(false);
    const [deleteProfileDialog, setDeleteProfileDialog] = useState(false);
    const [deleteProfilesDialog, setDeleteProfilesDialog] = useState(false);
    const [profile, setProfile] = useState<Project.Profile>(emptyProfile);
    const [selectedProfiles, setSelectedProfiles] = useState<Project.Profile[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const profileService = new ProfileService();

    useEffect(() => {
        if (profiles.length == 0) {
            profileService.listAll()
                .then((response) => {
                    console.log(response.data)
                    setProfiles(response.data)
                }).catch((error) => {
                    console.log(error)
                });
        }
    }, [profile]);

    const openNew = () => {
        setProfile(emptyProfile);
        setSubmitted(false);
        setProfileDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProfileDialog(false);
    };

    const hideDeleteProfileDialog = () => {
        setDeleteProfileDialog(false);
    };

    const hideDeleteProfilesDialog = () => {
        setDeleteProfilesDialog(false);
    };

    const saveProfile = () => {
        setSubmitted(true);

        if (!profile.id) {
            profileService.insert(profile)
                .then((response) => {
                    setProfileDialog(false);
                    setProfile(emptyProfile);
                    setProfiles([]);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Profile registred successfully'
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
            profileService.update(profile)
                .then((response) => {
                    setProfileDialog(false)
                    setProfile(emptyProfile)
                    setProfiles([]);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Profile updated successfully'
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

    const editProfile = (profile: Project.Profile) => {
        setProfile({ ...profile });
        setProfileDialog(true);
    };

    const confirmDeleteProfile = (profile: Project.Profile) => {
        setProfile(profile);
        setDeleteProfileDialog(true);
    };

    const deleteProfile = () => {
        if (!profile.id) return;

        profileService.delete(profile.id)
            .then((response) => {
                setProfile(emptyProfile);
                setDeleteProfileDialog(false);
                setProfiles([]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Profile Deleted',
                    life: 3000
                });
            }).catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error while deleting profile',
                    life: 3000
                });
            })
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProfilesDialog(true);
    };

    const deleteSelectedProfiles = () => {
        Promise.all(selectedProfiles.map(async (_profile) => {
            if (_profile.id) {
                return await profileService.delete(_profile.id);
            }
        })).then((response) => {
            setProfiles([]);
            setSelectedProfiles([]);
            setDeleteProfilesDialog(false);
            setProfile(emptyProfile);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Profiles Deleted',
                life: 3000
            });
        }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error while deleting profiles',
                life: 3000
            })
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _profile = { ...profile };
        (_profile as any)[name] = val;

        setProfile(_profile);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProfiles || !(selectedProfiles as any).length} />
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

    const idBodyTemplate = (rowData: Project.Profile) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const descriptionBodyTemplate = (rowData: Project.Profile) => {
        return (
            <>
                <span className="p-column-title">Description</span>
                {rowData.description}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Project.Profile) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProfile(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProfile(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Profiles</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const profileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProfile} />
        </>
    );
    const deleteProfileDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProfileDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProfile} />
        </>
    );
    const deleteProfilesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProfilesDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProfiles} />
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
                        value={profiles}
                        selection={selectedProfiles}
                        onSelectionChange={(e) => setSelectedProfiles(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} profiles"
                        globalFilter={globalFilter}
                        emptyMessage="No profiles found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Code" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Description" sortable body={descriptionBodyTemplate} headerStyle={{ minWidth: '25rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={profileDialog} style={{ width: '450px' }} header="Profile Details" modal className="p-fluid" footer={profileDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea
                                id="description"
                                value={profile.description}
                                onChange={(e) => onInputChange(e, 'description')}
                                required
                                autoFocus
                                rows={5}
                                className={classNames({
                                    'p-invalid': submitted && !profile.description
                                })}
                            />
                            {submitted && !profile.description && <small className="p-invalid">Description is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProfileDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfileDialogFooter} onHide={hideDeleteProfileDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {profile && (
                                <span>
                                    Are you sure you want to delete the profile <b>{profile.description}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProfilesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfilesDialogFooter} onHide={hideDeleteProfilesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {profile && <span>Are you sure you want to delete the selected profiles?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Profile;
