"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import {fetchLeads, addLead, updateLead, deleteLead, selectLeads, selectLoading, selectError} from "@/lib/redux/features/leadSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const LeadsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const leads = useSelector(selectLeads);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", status: "New" });
  const [editLead, setEditLead] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  

    useEffect(() => {
      dispatch(fetchLeads());
    }, [dispatch]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const timestamp = new Date().toISOString();

    try {
      if (editLead) {
        await dispatch(updateLead(editLead.id, {
          ...form,
          status: form.status as "New" | "Contacted" | "Converted",
          createdOn: editLead.createdOn,
          updatedOn: timestamp,
        }));
        toast.success("Lead updated!");
      } else {
        await dispatch(
          addLead({
            ...form,
            status: form.status as "New" | "Contacted" | "Converted",
          })
        );
        toast.success("Lead added!");
      }

      // Reset state on success
      setForm({ name: "", email: "", phone: "", message: "", status: "New" });
      setEditLead(null);
      setIsOpen(false);
    } catch (err: any) {
      toast.error("Failed to submit lead");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (lead: any) => {
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
      status: lead.status,
    });
    setEditLead(lead);
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteItem?.id) return toast.error("Invalid lead ID.");
    setDeleting(true);
    try {
      await dispatch(deleteLead(deleteItem.id));
      toast.success("Lead deleted!");
    } catch {
      toast.error("Failed to delete lead.");
    }
    setDeleting(false);
    setDeleteItem(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditLead(null)}>Add Lead</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editLead ? "Edit Lead" : "Add Lead"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
              </select>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editLead ? "Update" : "Submit"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Phone</th>
                <th className="py-2 px-4 border">Message</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="py-2 px-4 border">{lead.name}</td>
                  <td className="py-2 px-4 border">{lead.email}</td>
                  <td className="py-2 px-4 border">{lead.phone}</td>
                  <td className="py-2 px-4 border">{lead.message}</td>
                  <td className="py-2 px-4 border">
                    <Badge
                      className={
                        lead.status === "New"
                          ? "bg-red-100 text-red-600"
                          : lead.status === "Contacted"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                      }
                    >
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="py-2 px-4 border space-x-2">
                    <Button size="sm" onClick={() => handleEdit(lead)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteItem({ id: lead.id!, name: lead.name })}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete <strong>{deleteItem?.name}</strong>?
          </p>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsPage;
