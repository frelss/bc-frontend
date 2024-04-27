import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail, resendVerificationEmail } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const [isResending, setIsResending] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");

  const { isLoading, error, user } = useSelector((state) => state.user);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token))
        .unwrap()
        .then(() => {
          setVerificationStatus("success");
          toast.success("Email verified successfully. You can now log in.");
        })
        .catch(() => {
          setVerificationStatus("failure");
        });
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (verificationStatus === "success") {
      navigate("/bejelentkezes");
    }
  }, [verificationStatus, navigate]);

  const handleOpenDialog = () => {
    setEmail(user?.email || "");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleResendEmail = () => {
    setIsResending(true);
    dispatch(resendVerificationEmail(email))
      .unwrap()
      .then(() => {
        toast.succes("Verification email resent successfully.");
      })
      .catch((error) => {
        toast.error(error || "Failed to resend verification email.");
      })
      .finally(() => {
        setIsResending(false);
        handleCloseDialog();
      });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {verificationStatus === "failure" && (
            <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4 bg-0">
              <ErrorOutlineIcon
                style={{ color: "#EF4444", fontSize: "60px" }}
              />
              <p className="text-red-500 text-xl">{error}</p>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpenDialog}
                disabled={isResending}
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </Button>
            </div>
          )}
          <ThemeProvider theme={darkTheme}>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Resend Verification Email</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleResendEmail}>Resend Email</Button>
              </DialogActions>
            </Dialog>
          </ThemeProvider>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          />
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
